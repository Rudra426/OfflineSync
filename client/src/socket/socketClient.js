import { io } from 'socket.io-client';
import { applyRemoteChange } from '../db/localDb.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const socket = io(API_URL);

export const getSocketId = () => socket.id;

let updateCallback = null;

export const setSocketUpdateCallback = (cb) => {
  updateCallback = cb;
};

export const initializeSocketListeners = () => {
  socket.off('sync_update');
  
  socket.on('sync_update', async ({ action, payload }) => {
    try {
      // Direct apply to Dexie without triggering queues
      await applyRemoteChange(action, payload);
      if (updateCallback && payload.id) {
        updateCallback(payload.id);
      }
    } catch (error) {
      console.error('Error applying real-time update:', error);
    }
  });
};
