import React, { useEffect, useState, useCallback } from 'react';
import { useOnlineStatus } from './hooks/useOnlineStatus.js';
import { processSyncQueue } from './sync/syncManager.js';
import { createNote, getAllNotes, updateNote, deleteNote } from './db/localDb.js';
import { enqueueSyncAction, getConflictedItems, getSyncQueue } from './sync/syncQueue.js';
import { initializeSocketListeners, setSocketUpdateCallback } from './socket/socketClient.js';

import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import DashboardMetrics from './components/DashboardMetrics.jsx';
import NoteCard from './components/NoteCard.jsx';
import NoteForm from './components/NoteForm.jsx';

function App() {
  const nativeIsOnline = useOnlineStatus();
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const isOnline = nativeIsOnline && !simulatedOffline;

  const [notes, setNotes] = useState([]);
  const [syncQueue, setSyncQueue] = useState([]);
  const [conflictedItems, setConflictedItems] = useState([]);
  const [realtimeUpdatedIds, setRealtimeUpdatedIds] = useState(new Set());

  const [view, setView] = useState('list'); // 'list' | 'form'
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [filter, setFilter] = useState('all'); // 'all' | 'synced' | 'queued' | 'conflict'

  const loadData = useCallback(async () => {
    const allNotes = await getAllNotes();
    setNotes(allNotes);
    const queue = await getSyncQueue();
    setSyncQueue(queue);
    const conflicts = await getConflictedItems();
    setConflictedItems(conflicts);
  }, []);

  useEffect(() => {
    initializeSocketListeners();
    setSocketUpdateCallback((id) => {
      loadData();
      setRealtimeUpdatedIds(prev => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      setTimeout(() => {
        setRealtimeUpdatedIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 5000);
    });
    
    // Initial load
    loadData();
    // Poll local DB to catch offline queue changes easily
    const interval = setInterval(loadData, 1000); 
    return () => clearInterval(interval);
  }, [loadData]);

  useEffect(() => {
    if (isOnline) {
      handleProcessSyncQueue();
    }
  }, [isOnline]);

  const handleProcessSyncQueue = async () => {
    if (!isOnline) return;
    setIsSyncing(true);
    await processSyncQueue();
    await loadData();
    setIsSyncing(false);
  };

  const handleSaveNote = async (title, content) => {
    const newNote = {
      id: editingNoteId || crypto.randomUUID(),
      title,
      content,
      version: editingNoteId ? (notes.find(n => n.id === editingNoteId)?.version || 1) : 1
    };
    
    if (editingNoteId) {
      await updateNote(editingNoteId, newNote);
      await enqueueSyncAction('update', newNote);
    } else {
      await createNote(newNote);
      await enqueueSyncAction('create', newNote);
    }
    
    if (isOnline) handleProcessSyncQueue();
    else loadData();
    
    setView('list');
    setEditingNoteId(null);
  };

  const handleDeleteNote = async (id) => {
    const noteToDelete = notes.find(n => n.id === id);
    const version = noteToDelete ? noteToDelete.version : 1;
    await deleteNote(id);
    await enqueueSyncAction('delete', { id, version });
    if (isOnline) handleProcessSyncQueue();
    else loadData();
  };

  const openForm = (id = null) => {
    setEditingNoteId(id);
    setView('form');
  };

  const getSyncState = (noteId) => {
    if (conflictedItems.some(i => i.payload.id === noteId)) return 'conflict';
    if (syncQueue.some(i => i.payload.id === noteId && !i.conflicted)) return 'queued';
    return 'synced';
  };

  const editingNote = editingNoteId ? notes.find(n => n.id === editingNoteId) : null;
  const queuedCount = syncQueue.filter(i => !i.conflicted).length;
  const conflictCount = conflictedItems.length;
  const syncedCount = notes.filter(n => getSyncState(n.id) === 'synced').length;

  const filteredNotes = notes.filter(n => {
    if (filter === 'all') return true;
    return getSyncState(n.id) === filter;
  });

  return (
    <div className="bg-background font-body-md text-on-surface antialiased">
      <Sidebar 
        pendingQueueCount={queuedCount} 
        isOnline={isOnline} 
        simulatedOffline={simulatedOffline} 
        onToggleSimulateOffline={() => setSimulatedOffline(!simulatedOffline)} 
        onNewNote={() => openForm()}
        onFlushQueue={handleProcessSyncQueue}
        isSyncing={isSyncing}
      />
      <div className="pl-72">
        <Header />
        <main className="w-full pt-16 bg-background min-h-screen">
          <div className="flex flex-col w-full">
            {view === 'list' && (
              <section className="flex flex-col w-full p-space-lg lg:p-margin-lg space-y-space-lg">
                <div className="w-full bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
                  <div className="flex items-center gap-space-md">
                    <div className={`w-12 h-12 rounded-xl ${isOnline ? 'bg-surface-container-low text-primary' : 'bg-surface-container-high text-secondary'} flex items-center justify-center transition-colors`}>
                      <span className="material-symbols-outlined text-[26px]">{isSyncing ? 'sync' : (isOnline ? 'cloud_done' : 'cloud_off')}</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-space-xs">
                        <h1 className="font-headline-lg text-headline-lg text-on-surface">Offline-First Data Pipeline</h1>
                        <span className={`px-2 py-0.5 rounded-full ${isOnline ? 'bg-surface-container text-primary' : 'bg-secondary-fixed text-on-secondary-fixed-variant'} font-label-sm text-label-sm inline-flex items-center gap-1.5 font-semibold`}>
                          <span className={`w-2 h-2 rounded-full ${isOnline && !isSyncing ? 'bg-primary-container animate-pulse' : 'bg-secondary-container'}`}></span>
                          {isSyncing ? "SYNCING CHANGES..." : (isOnline ? "ONLINE & SYNCED" : "OFFLINE: SAVED LOCALLY")}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        {isOnline ? "Synchronized with upstream database. Local cache verified." : "Socket disconnected. Mutations write safely to journal and queue automatically."}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-space-sm bg-surface-container-low p-space-xs rounded-lg">
                    <div className="flex items-center gap-space-xs px-space-sm py-1 bg-surface-container-lowest rounded-lg">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Queue:</span>
                      <span className="font-code-sm text-code-sm font-semibold text-secondary-container bg-surface-container px-2 py-0.5 rounded">
                        {queuedCount} change{queuedCount !== 1 && 's'} pending
                      </span>
                    </div>
                  </div>
                </div>

                <DashboardMetrics syncedCount={syncedCount} queuedCount={queuedCount} conflictCount={conflictCount} />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pt-space-xs">
                  <div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-lg">
                    {['all', 'synced', 'queued', 'conflict'].map(f => (
                      <button 
                        key={f}
                        onClick={() => setFilter(f)} 
                        className={`filter-tab px-space-md py-1.5 rounded-lg font-headline-sm text-headline-sm transition-all ${filter === f ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
                        {f === 'all' ? <>All Notes <span className="ml-1 px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface font-code-sm text-code-sm">{notes.length}</span></> : f === 'synced' ? 'Synced' : f === 'queued' ? 'Pending' : 'Conflicts'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                  {filteredNotes.map(note => (
                    <NoteCard 
                      key={note.id} 
                      note={note} 
                      syncState={getSyncState(note.id)} 
                      isRealtimeUpdated={realtimeUpdatedIds.has(note.id)}
                      onEdit={openForm}
                      onDelete={handleDeleteNote}
                    />
                  ))}
                </div>
              </section>
            )}

            {view === 'form' && (
              <NoteForm 
                noteId={editingNoteId}
                initialTitle={editingNote?.title}
                initialContent={editingNote?.content}
                onSave={handleSaveNote}
                onCancel={() => setView('list')}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
