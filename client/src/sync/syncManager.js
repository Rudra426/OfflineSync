import { getSyncQueue, removeFromQueue, markAsConflicted } from './syncQueue.js';
import { getSocketId } from '../socket/socketClient.js';
import { updateNote } from '../db/localDb.js';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`;

export const processSyncQueue = async () => {
  const queue = await getSyncQueue();
  const activeQueue = queue.filter(item => !item.conflicted);
  
  if (activeQueue.length === 0) return;

  for (const item of activeQueue) {
    try {
      const payloadWithSocket = { ...item, clientSocketId: getSocketId() };

      const response = await fetch(`${API_URL}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payloadWithSocket)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.record && (item.action === 'create' || item.action === 'update')) {
          await updateNote(data.record.id, { version: data.record.version });
        }
        await removeFromQueue(item.id);
      } else if (response.status === 409) {
        console.warn('Conflict detected for item:', item.id);
        await markAsConflicted(item.id);
      } else {
        console.error('Failed to sync item:', item);
      }
    } catch (error) {
      console.error('Network error during sync:', error);
      break; // Stop processing if network goes down during sync
    }
  }
};
