import React from 'react';
import { X, Bot, Shield, Cpu, Database, FileText, CheckCircle2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Platform Settings & Architecture</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">AI Multi-Agent Virtual Consulting Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300">
          {/* Agent Architecture Overview */}
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-200 block mb-2 text-xs">
              Autonomous Agent Orchestration Mesh
            </span>
            <div className="space-y-2">
              <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-start gap-2.5">
                <Cpu className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-200">Central AI Manager Agent (Supervisor)</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Extracts structured business context, designs consultation plan, coordinates parallel execution, validates & reconciles specialist reports into 12 sections.
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-200">3 Specialist Agent Adapters</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Clean integration interfaces for Market Research, Marketing Strategy, and Finance Modeling agents with explicit reliability and provenance tagging.
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-start gap-2.5">
                <FileText className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-200">Customer Support Agent (PDF Generation)</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Receives validated final report and compiles high-fidelity multi-page PDF documents using PDFKit engine.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reliability Safeguards */}
          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-semibold text-slate-900 dark:text-slate-200 block">Reliability & Compliance Safeguards</span>
            <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>Never presents fabricated research or financial figures as verified facts</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>Clearly distinguishes between verified data vs explicit assumptions</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>Explicitly disclaims all financial and regulatory projections</span>
              </li>
            </ul>
          </div>

          {/* Persistence Info */}
          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-slate-800 dark:text-slate-200">Persistence Layer</span>
            </div>
            <span className="text-slate-500 dark:text-slate-400 font-mono">Atomic Disk Store (data/consultations.json)</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
