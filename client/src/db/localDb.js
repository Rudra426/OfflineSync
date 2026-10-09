import Dexie from 'dexie';

export const localDb = new Dexie('OfflineSyncDB');

// We define 'id' as the primary key. Dexie only needs us to list fields we want to index for searching.
// We only need the primary key indexed for basic CRUD.
localDb.version(1).stores({
  notes: 'id' 
});

localDb.version(2).stores({
  syncQueue: '++id, recordId, action, timestamp'
});

// Basic CRUD operations for the local IndexedDB
export const createNote = async (note) => {
  // `note` is expected to have { id, title, content, version }
  return await localDb.notes.add(note);
};

export const updateNote = async (id, updatedFields) => {
  return await localDb.notes.update(id, updatedFields);
};

export const deleteNote = async (id) => {
  return await localDb.notes.delete(id);
};

export const getAllNotes = async () => {
  return await localDb.notes.toArray();
};

// Function for Socket.IO real-time updates from other devices
export const applyRemoteChange = async (action, payload) => {
  if (action === 'create' || action === 'update') {
    // .put acts as an upsert, safely overwriting local without throwing constraint errors
    await localDb.notes.put(payload);
  } else if (action === 'delete') {
    await localDb.notes.delete(payload.id);
  }
};
