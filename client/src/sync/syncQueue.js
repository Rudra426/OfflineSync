import { localDb } from '../db/localDb.js';

export const enqueueSyncAction = async (action, record) => {
  // Clear any existing conflicted actions for this note so the count doesn't artificially inflate
  // and so the note isn't permanently stuck in a conflicted state after a new edit.
  const existingQueue = await localDb.syncQueue.where({ recordId: record.id }).toArray();
  for (const item of existingQueue) {
    if (item.conflicted) {
      await localDb.syncQueue.delete(item.id);
    }
  }

  const queueItem = {
    action,
    recordId: record.id,
    version: record.version,
    payload: record,
    timestamp: Date.now()
  };
  
  await localDb.syncQueue.add(queueItem);
};

export const getSyncQueue = async () => {
  return await localDb.syncQueue.orderBy('timestamp').toArray();
};

export const removeFromQueue = async (id) => {
  return await localDb.syncQueue.delete(id);
};

export const clearSyncQueue = async () => {
  return await localDb.syncQueue.clear();
};

export const markAsConflicted = async (id) => {
  await localDb.syncQueue.update(id, { conflicted: true });
};

export const getConflictedItems = async () => {
  const queue = await localDb.syncQueue.toArray();
  return queue.filter(item => item.conflicted);
};
