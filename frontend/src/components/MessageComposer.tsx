import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Loader2 } from 'lucide-react';

interface MessageComposerProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  isLoading,
  placeholder = 'Describe your business idea, proposed location, or investment constraints...'
}) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as text grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="w-full bg-white/90 dark:bg-slate-950/80 backdrop-blur border-t border-slate-200 dark:border-slate-800/80 p-3 sm:p-4 transition-colors">
      <div className="max-w-3xl mx-auto relative flex items-end bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 focus-within:border-blue-500 rounded-2xl p-2 transition-all shadow-sm dark:shadow-lg dark:shadow-black/20">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm resize-none focus:outline-none px-2 py-1.5 max-h-44 overflow-y-auto"
        />

        <button
          onClick={handleSend}
          disabled={!text.trim() || isLoading}
          className={`shrink-0 p-2 rounded-xl transition-all ${
            text.trim() && !isLoading
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
          title="Send message (Enter)"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowUp className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="text-center mt-2">
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          AI Manager extracts parameters and coordinates specialist agents. Enter to send, Shift+Enter for new line.
        </span>
      </div>
    </div>
  );
};
