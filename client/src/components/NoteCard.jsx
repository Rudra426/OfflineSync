
import React from 'react';

export default function NoteCard({ note, syncState, isRealtimeUpdated, onEdit, onDelete }) {
  const isConflict = syncState === 'conflict';
  const isQueued = syncState === 'queued';
  const isSynced = syncState === 'synced';

  const indicatorColor = isConflict ? 'bg-tertiary' : isQueued ? 'bg-secondary-container' : 'bg-primary-container';
  
  return (
    <article className="note-card relative bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${indicatorColor}`}></div>
      <div className="pl-space-xs flex-1 flex flex-col">
        {isRealtimeUpdated && isSynced && (
          <div className="mb-space-sm py-1 px-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container"></span>
              </span>
              <span className="font-label-sm text-label-sm text-primary font-medium">Updated in real-time</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Just now</span>
          </div>
        )}
        {isConflict && (
          <div className="mb-space-md p-space-sm rounded-lg bg-error-container text-on-error-container flex items-start gap-space-xs">
            <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">error</span>
            <span className="font-label-md text-label-md font-semibold leading-snug">
              Version Conflict Detected: This change was rejected because a newer update exists on the server.
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-space-sm">
          {isSynced && !isRealtimeUpdated && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">check</span>
              <span>Synced</span>
            </span>
          )}
          {isQueued && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>Pending Sync</span>
            </span>
          )}
          <span className="font-body-sm text-body-sm text-on-surface-variant ml-auto">v{note.version || 1}</span>
        </div>
        
        <h2 className="font-headline-md text-headline-md text-on-surface mb-space-xs">{note.title}</h2>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed line-clamp-3 mb-space-md">{note.content}</p>
        
        <div className="flex flex-wrap items-center gap-space-xs mb-space-md mt-auto">
          <span className="font-code-sm text-code-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">#note</span>
        </div>
      </div>
      
      <div className="pt-space-sm pl-space-xs flex items-center justify-between bg-surface-container-low/40 -mx-space-lg -mb-space-lg px-space-lg py-space-sm">
        <span className={`font-label-sm text-label-sm ${isConflict ? 'text-tertiary' : isQueued ? 'text-secondary' : 'text-primary'} font-medium flex items-center gap-1`}>
          {isConflict ? (
            <><span className="material-symbols-outlined text-[14px]">merge_type</span> Rebase Required</>
          ) : isQueued ? (
            <><span className="material-symbols-outlined text-[14px]">cloud_off</span> Stored in IndexedDB</>
          ) : (
            <><span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span> Cloud Replica Valid</>
          )}
        </span>
        <div className="flex items-center gap-space-xs">
          <button onClick={() => onEdit(note.id)} className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors" title="Edit note" type="button">
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button onClick={() => onDelete(note.id)} className="p-1.5 rounded-lg text-on-surface-variant hover:text-tertiary hover:bg-error-container transition-colors" title="Delete note" type="button">
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>
    </article>
  );
}
