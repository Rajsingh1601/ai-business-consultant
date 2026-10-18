import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  FileText, 
  Download, 
  Activity, 
  Plus,
  Sun,
  Moon
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MessageItem } from './components/MessageItem';
import { MessageComposer } from './components/MessageComposer';
import { AgentStatusDashboard } from './components/AgentStatusDashboard';
import { ReportViewer } from './components/ReportViewer';
import { SettingsModal } from './components/SettingsModal';
import { api } from './services/api';
import type { Conversation } from './types';

export const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConsultationRunning, setIsConsultationRunning] = useState(false);

  // Theme State: Dark / Light
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // default
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  // Initial load: Fetch conversations list
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const list = await api.getConversations();
      setConversations(list);
      if (list.length > 0 && !activeId) {
        selectConversation(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  const selectConversation = async (id: string) => {
    try {
      setActiveId(id);
      const conv = await api.getConversation(id);
      setActiveConversation(conv);
    } catch (err) {
      console.error('Failed to fetch conversation details:', err);
    }
  };

  // Real-time SSE subscription for active conversation
  useEffect(() => {
    if (!activeId) return;

    const unsubscribe = api.subscribeEvents(activeId, (data) => {
      if (data.state) {
        setActiveConversation((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            dashboardState: data.state,
            finalReport: data.finalReport || prev.finalReport
          };
        });

        // If manager completed or failed, update running state
        if (data.state.manager?.status === 'Completed' || data.state.manager?.status === 'Failed') {
          setIsConsultationRunning(false);
          // Refresh full conversation state to get assistant's summary message
          api.getConversation(activeId).then((fullConv) => {
            setActiveConversation(fullConv);
            setConversations((prev) => prev.map((c) => (c.id === fullConv.id ? fullConv : c)));
          });
        }
      }
    });

    // Also poll every 2.5 seconds while consultation is running as fallback
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isConsultationRunning) {
      interval = setInterval(async () => {
        try {
          const status = await api.getStatus(activeId);
          setActiveConversation((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              dashboardState: status.dashboardState,
              consultationPlan: status.plan,
              finalReport: status.finalReport
            };
          });
          if (status.dashboardState.manager.status === 'Completed' || status.dashboardState.manager.status === 'Failed') {
            setIsConsultationRunning(false);
            const fullConv = await api.getConversation(activeId);
            setActiveConversation(fullConv);
          }
        } catch (e) {
          console.warn('Status poll error:', e);
        }
      }, 2500);
    }

    return () => {
      unsubscribe();
      if (interval) clearInterval(interval);
    };
  }, [activeId, isConsultationRunning]);

  // Create New Consultation
  const handleNewChat = async () => {
    try {
      setIsLoading(true);
      const newConv = await api.createConversation('New Business Consultation');
      setConversations([newConv, ...conversations]);
      setActiveId(newConv.id);
      setActiveConversation(newConv);
      setIsReportModalOpen(false);
    } catch (err) {
      console.error('Failed to create new chat:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Rename Conversation
  const handleRename = async (id: string, newTitle: string) => {
    try {
      const updated = await api.renameConversation(id, newTitle);
      if (updated) {
        setConversations(conversations.map((c) => (c.id === id ? updated : c)));
        if (activeConversation?.id === id) {
          setActiveConversation(updated);
        }
      }
    } catch (err) {
      console.error('Failed to rename conversation:', err);
    }
  };

  // Delete Conversation
  const handleDelete = async (id: string) => {
    try {
      await api.deleteConversation(id);
      const remaining = conversations.filter((c) => c.id !== id);
      setConversations(remaining);
      if (activeId === id) {
        if (remaining.length > 0) {
          selectConversation(remaining[0].id);
        } else {
          setActiveId(null);
          setActiveConversation(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  // Send Message
  const handleSendMessage = async (text: string) => {
    let targetConv = activeConversation;

    if (!targetConv) {
      try {
        targetConv = await api.createConversation('New Business Consultation');
        setConversations([targetConv, ...conversations]);
        setActiveId(targetConv.id);
        setActiveConversation(targetConv);
      } catch (err) {
        console.error('Failed to create conversation on send:', err);
        return;
      }
    }

    try {
      setIsLoading(true);
      const result = await api.sendMessage(targetConv.id, text);
      setActiveConversation(result.conversation);

      // Update conversations list with updated title/context
      setConversations((prev) =>
        prev.map((c) => (c.id === result.conversation.id ? result.conversation : c))
      );

      // Auto-launch multi-agent orchestration when essential parameters are ready!
      if (result.readyForRun) {
        setIsConsultationRunning(true);
        setIsDashboardOpen(true);
        api.runConsultation(result.conversation.id).catch((err) => {
          console.error('Auto run consultation error:', err);
          setIsConsultationRunning(false);
        });
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run Consultation Workflow (Manual button trigger)
  const handleRunConsultation = async () => {
    if (!activeConversation) return;

    try {
      setIsConsultationRunning(true);
      setIsDashboardOpen(true);
      await api.runConsultation(activeConversation.id);
    } catch (err) {
      console.error('Failed to launch consultation:', err);
      setIsConsultationRunning(false);
    }
  };

  // Retry Failed Task
  const handleRetryTask = async (taskId: string) => {
    if (!activeConversation) return;

    try {
      setIsConsultationRunning(true);
      await api.retryTask(activeConversation.id, taskId);
    } catch (err) {
      console.error('Failed to retry task:', err);
      setIsConsultationRunning(false);
    }
  };

  // Download PDF
  const handleDownloadPdf = () => {
    if (!activeConversation?.id) return;
    window.open(`/api/consultations/${activeConversation.id}/pdf`, '_blank');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Collapsible Left Sidebar */}
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={selectConversation}
        onNewChat={handleNewChat}
        onRename={handleRename}
        onDelete={handleDelete}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-white dark:bg-slate-900 overflow-hidden relative transition-colors duration-200">
        {/* Top Navbar */}
        <header className="h-13 bg-white/90 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between z-20 shrink-0 transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 truncate">
              <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                {activeConversation?.title || 'Your AI Business Consultant'}
              </span>
              {activeConversation?.businessContext?.location && (
                <span className="hidden sm:inline-block text-[11px] text-teal-600 dark:text-teal-400 font-medium px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20">
                  {activeConversation.businessContext.location}
                </span>
              )}
            </div>
          </div>

          {/* Action Pills */}
          <div className="flex items-center gap-2">
            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Dashboard Activity Toggle */}
            <button
              onClick={() => setIsDashboardOpen(!isDashboardOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                isDashboardOpen
                  ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title="Toggle Multi-Agent Status Activity Dashboard"
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Agent Activity</span>
            </button>

            {/* View Report Button if Final Report Exists */}
            {activeConversation?.finalReport && (
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium transition-colors shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">View Report</span>
              </button>
            )}

            {/* Download PDF Button */}
            {activeConversation?.finalReport?.pdfExport?.status === 'Completed' && (
              <button
                onClick={handleDownloadPdf}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-xs"
                title="Download PDF compiled by Customer Support Agent"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Download PDF</span>
              </button>
            )}

            {/* New Chat icon on mobile navbar */}
            <button
              onClick={handleNewChat}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:hidden"
              title="New consultation"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Agent Status Activity Dashboard (Hierarchical: Manager On Top, 4 Agents Underneath) */}
        {activeConversation && (
          <AgentStatusDashboard
            dashboardState={activeConversation.dashboardState}
            plan={activeConversation.consultationPlan}
            onRetryTask={handleRetryTask}
            isOpen={isDashboardOpen}
            onToggle={() => setIsDashboardOpen(!isDashboardOpen)}
          />
        )}

        {/* Chat Message Scrollable Container */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 transition-colors">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/20 pb-6">
              {activeConversation.messages.map((msg) => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  onRunConsultation={handleRunConsultation}
                  onOpenReport={() => setIsReportModalOpen(true)}
                  onDownloadPdf={handleDownloadPdf}
                  isRunning={isConsultationRunning}
                />
              ))}

              {/* Consultation In-Progress Live Banner */}
              {isConsultationRunning && (
                <div className="py-4 px-4 sm:px-6 bg-blue-50/80 dark:bg-blue-950/20 border-y border-blue-200/60 dark:border-blue-900/40">
                  <div className="max-w-3xl mx-auto flex items-center gap-3 text-xs text-blue-700 dark:text-blue-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                    <span>
                      Central AI Manager is coordinating Market Research, Marketing Strategy, and Finance specialists in parallel...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Fixed Message Composer at Bottom */}
        <MessageComposer
          onSendMessage={handleSendMessage}
          isLoading={isLoading || isConsultationRunning}
        />
      </div>

      {/* 12-Section Strategic Report Modal */}
      {isReportModalOpen && activeConversation?.finalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-fade-in">
          <ReportViewer
            report={activeConversation.finalReport}
            onClose={() => setIsReportModalOpen(false)}
          />
        </div>
      )}

      {/* Settings & Architecture Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default App;
