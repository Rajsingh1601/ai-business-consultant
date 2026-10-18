import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Settings, 
  Bot, 
  ChevronLeft
} from 'lucide-react';
import type { Conversation } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onRename,
  onDelete,
  isOpen,
  onToggle,
  onOpenSettings
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.businessContext?.businessType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.businessContext?.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRename = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRename(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this consultation session?')) {
      onDelete(id);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={onToggle}
        />
      )}

      <aside 
        className={`fixed md:static inset-y-0 left-0 z-40 flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-72 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-r-0'
        }`}
      >
        {/* Top Header & New Chat */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 block">AI Consultant</span>
                <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">Multi-Agent Engine</span>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-sm hover:shadow active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>New Consultation</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-3 pt-2 pb-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search consultations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Conversation History List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
          <div className="px-2 py-1 text-[11px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">
            Consultation Sessions
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-6 px-3 text-xs text-slate-400 dark:text-slate-500">
              {searchQuery ? 'No matching consultations found' : 'No previous consultations yet. Start a new one!'}
            </div>
          ) : (
            filtered.map((conv) => {
              const isActive = conv.id === activeId;
              const isEditing = editingId === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => onSelect(conv.id)}
                  className={`group relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />

                  {isEditing ? (
                    <div className="flex items-center gap-1 flex-1">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        autoFocus
                        className="w-full bg-white dark:bg-slate-950 border border-blue-500 rounded px-1.5 py-0.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                      <button
                        onClick={(e) => handleSaveRename(conv.id, e)}
                        className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        title="Save title"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleCancelRename}
                        className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="truncate flex-1">
                        <span className="block truncate">{conv.title}</span>
                        {conv.businessContext?.location && (
                          <span className="block text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            {conv.businessContext.location}
                          </span>
                        )}
                      </div>

                      {/* Actions on hover */}
                      <div className={`items-center gap-1 shrink-0 ${isActive ? 'flex' : 'hidden group-hover:flex'}`}>
                        <button
                          onClick={(e) => startRename(conv, e)}
                          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/60 rounded"
                          title="Rename"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(conv.id, e)}
                          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-700/60 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer: User Profile & Settings */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-medium text-slate-700 dark:text-slate-300">
                FD
              </div>
              <div className="leading-tight">
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 block">Entrepreneur</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">Free Tier Session</span>
              </div>
            </div>

            <button
              onClick={onOpenSettings}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
              title="Settings & System Info"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
