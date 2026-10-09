
import React, { useState, useEffect } from 'react';

export default function NoteForm({ noteId, initialTitle, initialContent, onSave, onCancel }) {
  const [title, setTitle] = useState(initialTitle || '');
  const [content, setContent] = useState(initialContent || '');

  useEffect(() => {
    setTitle(initialTitle || '');
    setContent(initialContent || '');
  }, [initialTitle, initialContent, noteId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(title, content);
  };

  return (
    <section className="flex flex-col w-full p-space-lg lg:p-margin-lg max-w-4xl mx-auto space-y-space-lg">
      <div className="flex items-center justify-between">
        <button onClick={onCancel} className="flex items-center gap-space-xs text-on-surface-variant hover:text-on-surface font-headline-sm text-headline-sm transition-colors" type="button">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span>Back to All Notes</span>
        </button>
        <div className="px-space-sm py-1 rounded-full bg-surface-container text-primary font-code-sm text-code-sm">
          {noteId ? `EDITING ID: #${noteId}` : 'MODE: DRAFT'}
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-md flex flex-col space-y-space-lg">
        <div className="border-b border-surface-container pb-space-md">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">{noteId ? 'Edit Note' : 'Create New Note'}</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Your changes write immediately to the local journal before pushing through the replication worker.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-space-md">
          <div className="flex flex-col space-y-space-xs">
            <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="title">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} id="title" className="w-full px-space-md py-2.5 bg-surface-container-low text-on-surface font-headline-sm text-headline-sm rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all placeholder:text-on-surface-variant" placeholder="Note title..." required type="text"/>
          </div>
          <div className="flex flex-col space-y-space-xs">
            <label className="font-label-md text-label-md text-on-surface font-medium" htmlFor="content">Content</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} id="content" className="w-full p-space-md bg-surface-container-low text-on-surface font-body-lg text-body-lg rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all placeholder:text-on-surface-variant resize-y" placeholder="Write your note markdown or plain text here..." required rows="8"></textarea>
          </div>
          <div className="flex items-center justify-end gap-space-sm pt-space-md border-t border-surface-container">
            <button onClick={onCancel} className="px-space-lg py-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-headline-sm text-headline-sm transition-colors" type="button">
              Cancel
            </button>
            <button className="flex items-center gap-space-xs px-space-xl py-2 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-headline-sm text-headline-sm shadow-sm transition-all" type="submit">
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Save Note</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
