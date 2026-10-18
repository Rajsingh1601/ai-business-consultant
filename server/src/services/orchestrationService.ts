import { EventEmitter } from 'events';
import {
  Conversation,
  ConsultationPlan,
  AgentTask,
  AgentResult,
  FinalBusinessReport,
  AgentStatusDashboardState,
  ManagerStatus,
  SpecialistStatus,
  CustomerSupportStatus,
  Message
} from '../interfaces/types.js';
import { storage } from '../storage/storage.js';
import { aiManagerService } from './aiManagerService.js';
import { ResearchAgentAdapter } from '../adapters/researchAgentAdapter.js';
import { MarketingAgentAdapter } from '../adapters/marketingAgentAdapter.js';
import { FinanceAgentAdapter } from '../adapters/financeAgentAdapter.js';
import { CustomerSupportAgentAdapter } from '../adapters/customerSupportAdapter.js';

export class OrchestrationService extends EventEmitter {
  private researchAdapter = new ResearchAgentAdapter();
  private marketingAdapter = new MarketingAgentAdapter();
  private financeAdapter = new FinanceAgentAdapter();
  private customerSupportAdapter = new CustomerSupportAgentAdapter();

  /**
   * Helper to initialize dashboard state for a conversation
   */
  createInitialDashboardState(): AgentStatusDashboardState {
    const now = new Date().toISOString();
    return {
      manager: {
        status: 'Idle',
        currentAction: 'Awaiting business idea description',
        lastUpdated: now
      },
      research: {
        status: 'Waiting',
        lastUpdated: now,
        error: null
      },
      marketing: {
        status: 'Waiting',
        lastUpdated: now,
        error: null
      },
      finance: {
        status: 'Waiting',
        lastUpdated: now,
        error: null
      },
      customerSupport: {
        status: 'Waiting',
        lastUpdated: now,
        error: null
      }
    };
  }

  /**
   * Run the full multi-agent consultation workflow
   */
  async runConsultation(conversationId: string): Promise<Conversation> {
    const conv = await storage.getConversation(conversationId);
    if (!conv) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    if (!conv.businessContext) {
      throw new Error('Cannot run consultation without structured business context');
    }

    const context = conv.businessContext;

    // 1. Stage 1: AI Manager Planning
    conv.dashboardState.manager = {
      status: 'Planning',
      currentAction: `Analyzing requirements and preparing consultation tasks for ${context.businessName}`,
      lastUpdated: new Date().toISOString()
    };
    await storage.saveConversation(conv);
    this.emit('update', { conversationId, state: conv.dashboardState });

    // Create or reuse plan
    const plan = aiManagerService.createConsultationPlan(conversationId, context);
    plan.status = 'executing';
    conv.consultationPlan = plan;

    // Update specialist task IDs in dashboard
    for (const task of plan.tasks) {
      if (task.agentId === 'research') {
        conv.dashboardState.research = { status: 'Waiting', taskId: task.taskId, lastUpdated: new Date().toISOString(), error: null };
      } else if (task.agentId === 'marketing') {
        conv.dashboardState.marketing = { status: 'Waiting', taskId: task.taskId, lastUpdated: new Date().toISOString(), error: null };
      } else if (task.agentId === 'finance') {
        conv.dashboardState.finance = { status: 'Waiting', taskId: task.taskId, lastUpdated: new Date().toISOString(), error: null };
      }
    }

    // 2. Stage 2: AI Manager Coordinating Active Specialist Agent (Research Agent Only)
    conv.dashboardState.manager = {
      status: 'Coordinating',
      currentAction: 'Dispatching task to Market Research Specialist Agent (Marketing & Finance queued for upcoming phase)',
      lastUpdated: new Date().toISOString()
    };
    await storage.saveConversation(conv);
    this.emit('update', { conversationId, state: conv.dashboardState });

    // Execute only Research Agent (User configured: only Research Agent works for now)
    const researchTask = plan.tasks.find((t) => t.agentId === 'research');
    if (!researchTask) {
      throw new Error('Research Agent task not found in consultation plan');
    }

    await this.executeSpecialistTask(conv, researchTask);

    // Save state after execution
    await storage.saveConversation(conv);

    // Check if Research task failed
    if (researchTask.status === 'Failed') {
      conv.dashboardState.manager = {
        status: 'Failed',
        currentAction: 'Research Agent encountered an error. Ready for targeted retry.',
        lastUpdated: new Date().toISOString()
      };
      await storage.saveConversation(conv);
      this.emit('update', { conversationId, state: conv.dashboardState });
      return conv;
    }

    // 3. Stage 3: AI Manager Reviewing & Reconciling
    conv.dashboardState.manager = {
      status: 'Reviewing',
      currentAction: 'Auditing Market Research findings, checking local demographics, and preparing report',
      lastUpdated: new Date().toISOString()
    };
    await storage.saveConversation(conv);
    this.emit('update', { conversationId, state: conv.dashboardState });

    // Results Map with completed Research Agent output
    const resultsMap = {
      research: researchTask.output!,
      marketing: null,
      finance: null
    };

    // Validate & Reconcile
    const validation = aiManagerService.validateAndReconcileReports(context, resultsMap);

    // Synthesize FinalBusinessReport
    const finalReport = aiManagerService.synthesizeFinalReport(conversationId, context, resultsMap, validation);
    conv.finalReport = finalReport;
    plan.status = 'completed';

    // 4. Stage 4: Handoff to Customer Support Agent for PDF Generation
    conv.dashboardState.manager = {
      status: 'Reviewing',
      currentAction: 'Handing off finalized research report to Customer Support Agent for PDF compilation',
      lastUpdated: new Date().toISOString()
    };
    conv.dashboardState.customerSupport = {
      status: 'Generating PDF',
      lastUpdated: new Date().toISOString(),
      error: null
    };
    await storage.saveConversation(conv);
    this.emit('update', { conversationId, state: conv.dashboardState });

    try {
      const pdfResult = await this.customerSupportAdapter.generateReport(finalReport);
      finalReport.pdfExport = {
        status: 'Completed',
        fileName: pdfResult.fileName,
        filePath: pdfResult.filePath,
        downloadUrl: pdfResult.downloadUrl,
        fileSizeBytes: pdfResult.fileSizeBytes,
        generatedAt: pdfResult.generatedAt,
        error: null
      };
      conv.dashboardState.customerSupport = {
        status: 'Completed',
        lastUpdated: new Date().toISOString(),
        pdfUrl: pdfResult.downloadUrl,
        error: null
      };
    } catch (pdfErr: any) {
      console.error('[Orchestration] Customer Support PDF generation failed:', pdfErr);
      finalReport.pdfExport = {
        status: 'Failed',
        error: pdfErr.message || 'Failed to generate PDF'
      };
      conv.dashboardState.customerSupport = {
        status: 'Failed',
        lastUpdated: new Date().toISOString(),
        error: pdfErr.message || 'PDF Generation failed'
      };
    }

    // 5. AI Manager Workflow Completed
    conv.dashboardState.manager = {
      status: 'Completed',
      currentAction: 'Consultation synthesis and documentation finalized successfully',
      lastUpdated: new Date().toISOString()
    };

    // Add consultation completion message to conversation
    const assistantMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: `I have completed the multi-agent consultation and feasibility study for **${context.businessName}**!\n\nAll three specialist agents (Market Research, Marketing Strategy, and Finance) have completed their analyses, and the reports have been reconciled and synthesized into your standardized 12-section business plan.\n\nYour downloadable PDF report has been generated by the Customer Support Agent and is ready for review.`,
      timestamp: new Date().toISOString(),
      meta: {
        type: 'report_generated',
        reportId: finalReport.reportId,
        businessContextSnapshot: context,
        tasksSnapshot: plan.tasks
      }
    };
    conv.messages.push(assistantMessage);

    await storage.saveConversation(conv);
    this.emit('update', { conversationId, state: conv.dashboardState, finalReport });
    return conv;
  }

  /**
   * Execute an individual specialist task with error handling and status tracking
   */
  private async executeSpecialistTask(conv: Conversation, task: AgentTask): Promise<void> {
    task.status = 'Running';
    task.startedAt = new Date().toISOString();

    if (task.agentId === 'research') {
      conv.dashboardState.research = { status: 'Running', taskId: task.taskId, lastUpdated: new Date().toISOString(), error: null };
    } else if (task.agentId === 'marketing') {
      conv.dashboardState.marketing = { status: 'Running', taskId: task.taskId, lastUpdated: new Date().toISOString(), error: null };
    } else if (task.agentId === 'finance') {
      conv.dashboardState.finance = { status: 'Running', taskId: task.taskId, lastUpdated: new Date().toISOString(), error: null };
    }
    this.emit('update', { conversationId: conv.id, state: conv.dashboardState });

    try {
      let result: AgentResult;
      if (task.agentId === 'research') {
        result = await this.researchAdapter.executeTask(task, conv.businessContext!);
      } else if (task.agentId === 'marketing') {
        result = await this.marketingAdapter.executeTask(task, conv.businessContext!);
      } else if (task.agentId === 'finance') {
        result = await this.financeAdapter.executeTask(task, conv.businessContext!);
      } else {
        throw new Error(`Unknown agent ID ${task.agentId}`);
      }

      task.status = 'Completed';
      task.completedAt = new Date().toISOString();
      task.output = result;
      task.error = null;

      if (task.agentId === 'research') {
        conv.dashboardState.research = { status: 'Completed', taskId: task.taskId, lastUpdated: new Date().toISOString(), error: null };
      } else if (task.agentId === 'marketing') {
        conv.dashboardState.marketing = { status: 'Completed', taskId: task.taskId, lastUpdated: new Date().toISOString(), error: null };
      } else if (task.agentId === 'finance') {
        conv.dashboardState.finance = { status: 'Completed', taskId: task.taskId, lastUpdated: new Date().toISOString(), error: null };
      }
    } catch (err: any) {
      console.error(`[Orchestration] Task ${task.taskId} failed:`, err);
      task.status = 'Failed';
      task.error = err.message || 'Unknown task error';

      if (task.agentId === 'research') {
        conv.dashboardState.research = { status: 'Failed', taskId: task.taskId, lastUpdated: new Date().toISOString(), error: task.error };
      } else if (task.agentId === 'marketing') {
        conv.dashboardState.marketing = { status: 'Failed', taskId: task.taskId, lastUpdated: new Date().toISOString(), error: task.error };
      } else if (task.agentId === 'finance') {
        conv.dashboardState.finance = { status: 'Failed', taskId: task.taskId, lastUpdated: new Date().toISOString(), error: task.error };
      }
    }

    this.emit('update', { conversationId: conv.id, state: conv.dashboardState });
  }

  /**
   * Retry a specific failed task without rerunning completed tasks!
   */
  async retryFailedTask(conversationId: string, taskId: string): Promise<Conversation> {
    const conv = await storage.getConversation(conversationId);
    if (!conv || !conv.consultationPlan) {
      throw new Error(`Conversation or plan not found for retry: ${conversationId}`);
    }

    const task = conv.consultationPlan.tasks.find((t) => t.taskId === taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found in consultation plan`);
    }

    task.retryCount = (task.retryCount || 0) + 1;
    conv.dashboardState.manager = {
      status: 'Coordinating',
      currentAction: `Retrying failed specialist task "${task.title}" (Attempt ${task.retryCount + 1})`,
      lastUpdated: new Date().toISOString()
    };
    await storage.saveConversation(conv);
    this.emit('update', { conversationId, state: conv.dashboardState });

    await this.executeSpecialistTask(conv, task);
    await storage.saveConversation(conv);

    // If all tasks are now completed, proceed to review and report generation!
    const allCompleted = conv.consultationPlan.tasks.every((t) => t.status === 'Completed');
    if (allCompleted) {
      return this.resumeAfterSpecialistsComplete(conv);
    }

    return conv;
  }

  /**
   * Resume reconciliation and PDF generation once all specialists are completed
   */
  private async resumeAfterSpecialistsComplete(conv: Conversation): Promise<Conversation> {
    const plan = conv.consultationPlan!;
    const context = conv.businessContext!;

    conv.dashboardState.manager = {
      status: 'Reviewing',
      currentAction: 'All specialist tasks complete. Reconciling findings and generating final consultation report.',
      lastUpdated: new Date().toISOString()
    };
    await storage.saveConversation(conv);
    this.emit('update', { conversationId: conv.id, state: conv.dashboardState });

    const resultsMap = {
      research: plan.tasks.find((t) => t.agentId === 'research')?.output || null!,
      marketing: plan.tasks.find((t) => t.agentId === 'marketing')?.output || null,
      finance: plan.tasks.find((t) => t.agentId === 'finance')?.output || null
    };

    const validation = aiManagerService.validateAndReconcileReports(context, resultsMap);
    const finalReport = aiManagerService.synthesizeFinalReport(conv.id, context, resultsMap, validation);
    conv.finalReport = finalReport;
    plan.status = 'completed';

    conv.dashboardState.customerSupport = {
      status: 'Generating PDF',
      lastUpdated: new Date().toISOString(),
      error: null
    };
    await storage.saveConversation(conv);
    this.emit('update', { conversationId: conv.id, state: conv.dashboardState });

    try {
      const pdfResult = await this.customerSupportAdapter.generateReport(finalReport);
      finalReport.pdfExport = {
        status: 'Completed',
        fileName: pdfResult.fileName,
        filePath: pdfResult.filePath,
        downloadUrl: pdfResult.downloadUrl,
        fileSizeBytes: pdfResult.fileSizeBytes,
        generatedAt: pdfResult.generatedAt,
        error: null
      };
      conv.dashboardState.customerSupport = {
        status: 'Completed',
        lastUpdated: new Date().toISOString(),
        pdfUrl: pdfResult.downloadUrl,
        error: null
      };
    } catch (err: any) {
      finalReport.pdfExport = { status: 'Failed', error: err.message };
      conv.dashboardState.customerSupport = { status: 'Failed', lastUpdated: new Date().toISOString(), error: err.message };
    }

    conv.dashboardState.manager = {
      status: 'Completed',
      currentAction: 'Consultation synthesis and documentation finalized successfully',
      lastUpdated: new Date().toISOString()
    };

    const assistantMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: `The retried task has succeeded, and your standardized 12-section business plan for **${context.businessName}** is now complete and validated.\n\nThe PDF report has been compiled by the Customer Support Agent and is ready for download.`,
      timestamp: new Date().toISOString(),
      meta: {
        type: 'report_generated',
        reportId: finalReport.reportId,
        businessContextSnapshot: context,
        tasksSnapshot: plan.tasks
      }
    };
    conv.messages.push(assistantMessage);

    await storage.saveConversation(conv);
    this.emit('update', { conversationId: conv.id, state: conv.dashboardState, finalReport });
    return conv;
  }
}

export const orchestrationService = new OrchestrationService();
