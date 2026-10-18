import React from 'react';
import { Bot, User, FileText, Download } from 'lucide-react';
import type { Message } from '../types';
import { BusinessContextCard } from './BusinessContextCard';

interface MessageItemProps {
  message: Message;
  onRunConsultation?: () => void;
  onOpenReport?: () => void;
  onDownloadPdf?: () => void;
  isRunning?: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onRunConsultation,
  onOpenReport,
  onDownloadPdf,
  isRunning = false
}) => {
  const isUser = message.role === 'user';

  // Format content with basic bold and bullet formatting
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold handling
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-slate-900 dark:text-slate-100">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 text-xs text-slate-800 dark:text-slate-200">
            <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
            <span>{renderedParts}</span>
          </div>
        );
      }

      return (
        <p key={idx} className={line.trim() === '' ? 'h-2' : 'my-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300'}>
          {renderedParts}
        </p>
      );
    });
  };

  return (
    <div className={`py-4 px-4 sm:px-6 transition-colors ${
      isUser 
        ? 'bg-transparent' 
        : 'bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/70 dark:border-slate-800/40'
    }`}>
      <div className="max-w-3xl mx-auto flex gap-3.5">
        {/* Avatar */}
        <div className="shrink-0 pt-0.5">
          {isUser ? (
            <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <User className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Message Content & Metadata */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-xs text-slate-900 dark:text-slate-200">
              {isUser ? 'You' : 'AI Business Consultant'}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="text-xs">
            {renderFormattedText(message.content)}
          </div>

          {/* Context Snapshot Card */}
          {message.meta?.businessContextSnapshot && message.meta.type === 'plan_ready' && (
            <BusinessContextCard
              context={message.meta.businessContextSnapshot}
              onRunConsultation={onRunConsultation}
              isRunning={isRunning}
            />
          )}

          {/* Report Generated Action Banner */}
          {message.meta?.type === 'report_generated' && (
            <div className="mt-3 p-3.5 bg-white dark:bg-slate-950 border border-teal-500/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md shadow-teal-500/5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-200 block text-xs">
                    Business Plan & Feasibility Report
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    12 Standardized Sections • Customer Support PDF Compiled
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onOpenReport && (
                  <button
                    onClick={onOpenReport}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>View Plan</span>
                  </button>
                )}
                {onDownloadPdf && (
                  <button
                    onClick={onDownloadPdf}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
