
import React from 'react';

export default function Sidebar({ pendingQueueCount, isOnline, simulatedOffline, onToggleSimulateOffline, onNewNote, onFlushQueue, isSyncing }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest z-50 flex flex-col justify-between overflow-y-auto shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="p-space-lg">
        <div className="flex items-center gap-space-sm mb-space-lg">
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface leading-tight">OfflineSync</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">Local-First Notes</span>
          </div>
        </div>
        <div className="mb-space-lg">
          <button onClick={onNewNote} className="w-full flex items-center justify-center gap-space-sm bg-primary-container text-on-primary font-headline-sm text-headline-sm py-space-sm px-space-md rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:bg-primary transition-colors" type="button">
            <span className="material-symbols-outlined text-[20px]">add</span><span>New Note</span>
          </button>
        </div>
        <div className="mb-space-xs"><span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider px-space-sm">Navigation</span></div>
        <nav className="flex flex-col gap-space-xs">
          <a aria-current="page" className="flex items-center gap-space-sm px-space-md py-space-sm transition-colors bg-surface-container text-primary font-headline-sm rounded-lg" href="#"><span className="material-symbols-outlined text-[20px]">description</span><span>All Notes</span></a>
        </nav>
      </div>
      <div className="p-space-lg bg-surface-container-low m-space-sm rounded-xl">
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Simulation Rail</span>
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">tune</span>
        </div>
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.02)] mb-space-sm">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Engine State</span>
            {isOnline ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>Online</span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>Offline</span>
            )}
          </div>
          <div className="flex items-center justify-between pt-space-xs">
            <span className="font-body-sm text-body-sm text-on-surface">Queue Counter</span>
            <span className="font-code-sm text-code-sm px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface font-semibold">{pendingQueueCount} Pending</span>
          </div>
        </div>
        <div className="flex items-center justify-between py-space-xs mb-space-sm">
          <span className="font-body-sm text-body-sm text-on-surface">Network Adapter</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={!simulatedOffline} onChange={onToggleSimulateOffline} />
            <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container"></div>
          </label>
        </div>
        <div className="flex flex-col gap-space-xs">
          <span className="font-label-sm text-label-sm text-on-surface-variant mb-0.5">Simulate Pipeline</span>
          <button onClick={() => !simulatedOffline && onFlushQueue()} disabled={simulatedOffline || isSyncing} className="w-full text-left px-space-sm py-1 rounded bg-surface-container-lowest text-primary hover:bg-surface-container font-code-sm text-code-sm transition-colors" type="button">
            {isSyncing ? "• Syncing Changes..." : "• Flush Queue"}
          </button>
        </div>
      </div>
    </aside>
  );
}
