import React from 'react';
import { Bot, Sparkles, SlidersHorizontal, ArrowDown } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full text-center my-auto">
      {/* Icon & Heading */}
      <div className="mb-6 relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-blue-500/10 ring-4 ring-slate-200 dark:ring-slate-800/80 mx-auto transition-all">
          <Bot className="w-8 h-8" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-teal-500 text-slate-950 p-1 rounded-full shadow-md">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
        Your AI Business Consultant
      </h1>

      <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-lg mb-8 leading-relaxed">
        Turn your business idea into a structured, research-driven business plan.
      </p>

      {/* Clean instruction card (zero examples) */}
      <div className="w-full max-w-md p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-left space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <SlidersHorizontal className="w-4 h-4 text-teal-500" />
          <span>How It Works</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Describe your business concept, target location, and available capital in the composer below. The Central AI Manager will analyze requirements, organize specialist agents, and deliver a comprehensive feasibility study with an official downloadable PDF report.
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 font-medium pt-1 border-t border-slate-100 dark:border-slate-800">
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          <span>Type your idea in the box below to start</span>
        </div>
      </div>

      <div className="mt-8 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
        <span>Orchestrated by Central AI Manager with 4 Specialist Agents</span>
      </div>
    </div>
  );
};
