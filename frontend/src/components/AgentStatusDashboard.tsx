import React, { useState } from 'react';
import { 
  Bot, 
  Search, 
  Target, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Clock, 
  RotateCw, 
  ChevronDown, 
  ChevronUp, 
  Info,
  ArrowDown
} from 'lucide-react';
import type { AgentStatusDashboardState, ConsultationPlan, AgentTask } from '../types';

interface AgentStatusDashboardProps {
  dashboardState: AgentStatusDashboardState;
  plan: ConsultationPlan | null;
  onRetryTask: (taskId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const AgentStatusDashboard: React.FC<AgentStatusDashboardProps> = ({
  dashboardState,
  plan,
  onRetryTask,
  isOpen,
  onToggle
}) => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'Running':
      case 'Generating PDF':
      case 'Coordinating':
      case 'Planning':
      case 'Reviewing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            {status}
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3" />
            Failed
          </span>
        );
      case 'Waiting':
      case 'Idle':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <Clock className="w-3 h-3" />
            {status}
          </span>
        );
    }
  };

  const specialistAgents = [
    {
      id: 'research',
      name: 'Research Agent',
      role: 'Market Demographics & Competitors',
      status: dashboardState.research.status,
      taskId: dashboardState.research.taskId,
      error: dashboardState.research.error,
      icon: Search,
      color: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20'
    },
    {
      id: 'marketing',
      name: 'Marketing Agent',
      role: 'Audience Personas & Acquisition',
      status: dashboardState.marketing.status,
      taskId: dashboardState.marketing.taskId,
      error: dashboardState.marketing.error,
      icon: Target,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20'
    },
    {
      id: 'finance',
      name: 'Finance Agent',
      role: 'CapEx, OpEx & Break-Even Modeling',
      status: dashboardState.finance.status,
      taskId: dashboardState.finance.taskId,
      error: dashboardState.finance.error,
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 'customerSupport',
      name: 'Customer Support Agent',
      role: 'PDF Compilation & Delivery Handoff',
      status: dashboardState.customerSupport.status,
      pdfUrl: dashboardState.customerSupport.pdfUrl,
      error: dashboardState.customerSupport.error,
      icon: FileText,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
    }
  ];

  const getTaskForAgent = (agentId: string): AgentTask | undefined => {
    return plan?.tasks?.find((t) => t.agentId === agentId);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 transition-colors shadow-xs">
      {/* Top Banner / Toggle Bar */}
      <div 
        onClick={onToggle}
        className="px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">Multi-Agent Activity Dashboard</span>
          <span className="hidden sm:inline-block text-slate-500 dark:text-slate-400 text-[11px]">
            • Manager: <strong className="text-slate-800 dark:text-slate-200 font-medium">{dashboardState.manager.status}</strong>
          </span>
          <span className="hidden md:inline-block text-slate-400 dark:text-slate-500 text-[11px] truncate max-w-sm">
            ({dashboardState.manager.currentAction})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {dashboardState.customerSupport.status === 'Completed' && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-medium">
              PDF Ready
            </span>
          )}
          <button 
            className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded"
            title={isOpen ? 'Collapse Dashboard' : 'Expand Dashboard'}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Dashboard Body (Hierarchical: Manager On Top, 4 Agents Underneath) */}
      {isOpen && (
        <div className="p-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/70 space-y-4">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>
              Hierarchical Multi-Agent Architecture: Central AI Manager supervises and coordinates all four specialist agents.
            </span>
          </div>

          {/* 1. TOP NODE: CENTRAL AI MANAGER AGENT */}
          <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-500/30 dark:border-indigo-500/40 p-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-500/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">Central AI Manager Agent</span>
                    <span className="px-2 py-0.2 rounded text-[10px] uppercase tracking-wider font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      Chief Orchestrator
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Analyzes business requirements, constructs consultation tasks, coordinates 4 specialist agents, and reconciles reports
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {getStatusBadge(dashboardState.manager.status)}
              </div>
            </div>

            {/* Current Action Banner */}
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-600 dark:text-slate-400 text-[11px]">Active Focus:</span>
                <span className="font-medium text-slate-900 dark:text-slate-200 text-xs">
                  {dashboardState.manager.currentAction}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden md:inline">
                Updated {new Date(dashboardState.manager.lastUpdated).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* DOWNWARD HIERARCHY CONNECTOR */}
          <div className="flex flex-col items-center justify-center my-1 select-none">
            <div className="h-4 w-0.5 bg-gradient-to-b from-indigo-500 to-teal-500" />
            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 shadow-xs">
              <ArrowDown className="w-3 h-3 text-teal-500" />
              <span>Orchestrates 4 Specialist & Support Agents</span>
            </div>
            <div className="h-4 w-0.5 bg-gradient-to-b from-teal-500 to-blue-500" />
          </div>

          {/* 2. UNDERNEATH: ALL FOUR SPECIALIST AGENTS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {specialistAgents.map((ag) => {
              const IconComp = ag.icon;
              const task = getTaskForAgent(ag.id);
              const isTaskExpanded = task && expandedTaskId === task.taskId;

              return (
                <div
                  key={ag.id}
                  className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-1.5 rounded-lg border ${ag.color}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      {getStatusBadge(ag.status)}
                    </div>

                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs mb-0.5">
                      {ag.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-tight">
                      {ag.role}
                    </div>

                    {ag.error && (
                      <div className="text-[10px] text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 p-2 rounded border border-rose-200 dark:border-rose-800/50 mb-2">
                        Error: {ag.error}
                      </div>
                    )}

                    {task && (
                      <div className="mt-1 pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 space-y-1">
                        <div className="flex items-center justify-between font-mono text-[9px] text-slate-500">
                          <span>Task ID:</span>
                          <span className="truncate max-w-[100px]">{task.taskId}</span>
                        </div>

                        {task.status === 'Failed' && (
                          <button
                            onClick={() => onRetryTask(task.taskId)}
                            className="w-full mt-1.5 flex items-center justify-center gap-1.5 py-1 px-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium text-[11px] transition-colors"
                          >
                            <RotateCw className="w-3 h-3" />
                            Retry Specialist Task
                          </button>
                        )}

                        <button
                          onClick={() => setExpandedTaskId(isTaskExpanded ? null : task.taskId)}
                          className="w-full text-center text-blue-600 dark:text-blue-400 hover:text-blue-500 py-0.5 text-[10px] transition-colors"
                        >
                          {isTaskExpanded ? 'Hide Task Details' : 'View Task Details'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expanded Task Inspector Card */}
          {expandedTaskId && plan && (
            <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 shadow-sm">
              {(() => {
                const activeTask = plan.tasks.find((t) => t.taskId === expandedTaskId);
                if (!activeTask) return null;
                return (
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                      <div className="font-semibold text-xs text-slate-900 dark:text-slate-200">
                        Task Inspector: {activeTask.title}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(activeTask.status)}
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {activeTask.taskId}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Task Instructions & Input:
                        </span>
                        <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 leading-relaxed font-mono text-[10px]">
                          {activeTask.instructions}
                        </div>
                      </div>

                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Agent Output / Reliability Provenance:
                        </span>
                        <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 leading-relaxed max-h-36 overflow-y-auto">
                          {activeTask.output ? (
                            <div>
                              <div className="text-teal-600 dark:text-teal-400 font-medium mb-1">
                                {activeTask.output.summary}
                              </div>
                              <div className="text-[10px] text-amber-600 dark:text-amber-400/90 mb-1">
                                Provenance: {activeTask.output.provenance} (Mock: {activeTask.output.isMock ? 'Demonstration' : 'Real Integration'})
                              </div>
                              {activeTask.output.reliabilityNotes?.map((n, i) => (
                                <div key={i} className="text-[10px] text-slate-500 dark:text-slate-400">
                                  • {n}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 italic">No output produced yet.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
