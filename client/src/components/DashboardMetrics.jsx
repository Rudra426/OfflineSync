
import React from 'react';

export default function DashboardMetrics({ syncedCount, queuedCount, conflictCount }) {
  const total = syncedCount + queuedCount + conflictCount || 1;
  const syncedPct = (syncedCount / total) * 100;
  const queuedPct = (queuedCount / total) * 100;
  const conflictPct = (conflictCount / total) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Local Replicas</span>
          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
        </div>
        <div className="my-space-xs flex items-baseline gap-2">
          <span className="font-display-lg text-display-lg text-on-surface">{syncedCount}</span>
          <span className="font-label-sm text-label-sm text-primary">Up to date</span>
        </div>
        <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
          <div className="bg-primary-container h-full rounded-full" style={{ width: `${syncedPct}%` }}></div>
        </div>
      </div>
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Local Queue</span>
          <span className="material-symbols-outlined text-secondary-container text-[18px]">cloud_upload</span>
        </div>
        <div className="my-space-xs flex items-baseline gap-2">
          <span className="font-display-lg text-display-lg text-secondary">{queuedCount}</span>
          <span className="font-label-sm text-label-sm text-secondary">Awaiting link</span>
        </div>
        <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
          <div className="bg-secondary-container h-full rounded-full" style={{ width: `${queuedPct}%` }}></div>
        </div>
      </div>
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Branch Conflicts</span>
          <span className="material-symbols-outlined text-tertiary text-[18px]">warning</span>
        </div>
        <div className="my-space-xs flex items-baseline gap-2">
          <span className="font-display-lg text-display-lg text-tertiary">{conflictCount}</span>
          <span className="font-label-sm text-label-sm text-tertiary">Requires review</span>
        </div>
        <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
          <div className="bg-tertiary-container h-full rounded-full" style={{ width: `${conflictPct}%` }}></div>
        </div>
      </div>
    </div>
  );
}
