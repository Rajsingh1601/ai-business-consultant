import React from 'react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Users, 
  Calendar, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  SlidersHorizontal
} from 'lucide-react';
import type { BusinessContext } from '../types';

interface BusinessContextCardProps {
  context: BusinessContext;
  onRunConsultation?: () => void;
  isRunning?: boolean;
}

export const BusinessContextCard: React.FC<BusinessContextCardProps> = ({
  context,
  onRunConsultation,
  isRunning = false
}) => {
  const isComplete = context.missingEssentialFields.length === 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 my-3 text-xs shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-200 block text-xs">Structured Business Context</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Extracted & maintained by Central AI Manager</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
            Completeness: {context.completenessScore}%
          </span>
          {isComplete ? (
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              Ready
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <AlertCircle className="w-3 h-3" />
              Missing: {context.missingEssentialFields.join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* Structured Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-3.5">
        <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] mb-1">
            <Building2 className="w-3 h-3 text-blue-500" />
            <span>Type & Industry</span>
          </div>
          <div className="font-semibold text-slate-900 dark:text-slate-200 truncate">
            {context.businessType || <span className="text-slate-400 italic">Pending...</span>}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{context.industry}</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] mb-1">
            <MapPin className="w-3 h-3 text-teal-500" />
            <span>Target Location</span>
          </div>
          <div className="font-semibold text-slate-900 dark:text-slate-200 truncate">
            {context.location || <span className="text-slate-400 italic">Pending location...</span>}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Local catchment analysis</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] mb-1">
            <DollarSign className="w-3 h-3 text-emerald-500" />
            <span>Capital / Investment</span>
          </div>
          <div className="font-semibold text-slate-900 dark:text-slate-200">
            {context.initialInvestment.formatted || (
              <span className="text-slate-400 italic">To be estimated</span>
            )}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Currency: {context.initialInvestment.currency}</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] mb-1">
            <Users className="w-3 h-3 text-purple-500" />
            <span>Target Customers</span>
          </div>
          <div className="text-slate-900 dark:text-slate-200 text-xs truncate">
            {context.targetCustomers}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] mb-1">
            <Calendar className="w-3 h-3 text-orange-500" />
            <span>Target Timeline</span>
          </div>
          <div className="text-slate-900 dark:text-slate-200 text-xs truncate">
            {context.timeline}
          </div>
        </div>

        {context.constraintsAndPreferences.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
            <div className="text-slate-500 dark:text-slate-400 text-[10px] mb-1">Preferences & Constraints</div>
            <div className="text-slate-700 dark:text-slate-300 text-[11px] truncate">
              {context.constraintsAndPreferences.join(' • ')}
            </div>
          </div>
        )}
      </div>

      {/* Run Consultation Button */}
      {onRunConsultation && isComplete && (
        <button
          onClick={onRunConsultation}
          disabled={isRunning}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-medium text-xs shadow-md shadow-blue-500/10 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>
            {isRunning ? 'Consultation Orchestration in Progress...' : 'Launch Multi-Agent Consultation Workflow'}
          </span>
        </button>
      )}
    </div>
  );
};
