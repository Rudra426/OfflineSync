
import React from 'react';

export default function Header() {
  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-space-lg flex items-center justify-end">
      <div className="flex items-center gap-space-xs px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm">
        <span className="w-2 h-2 rounded-full bg-primary-container"></span>
        <span className="font-medium">All Changes Stored</span>
      </div>
    </header>
  );
}
