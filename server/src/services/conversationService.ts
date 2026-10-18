import { Conversation, Message, BusinessContext } from '../interfaces/types.js';
import { storage } from '../storage/storage.js';
import { aiManagerService } from './aiManagerService.js';
import { orchestrationService } from './orchestrationService.js';

export class ConversationService {
  async listConversations(searchQuery?: string): Promise<Conversation[]> {
    const list = await storage.getAllConversations();
    if (!searchQuery || !searchQuery.trim()) {
      return list;
    }
    const q = searchQuery.toLowerCase().trim();
    return list.filter((c) =>
      c.title.toLowerCase().includes(q) ||
      c.businessContext?.businessType?.toLowerCase().includes(q) ||
      c.businessContext?.location?.toLowerCase().includes(q)
    );
  }

  async getConversation(id: string): Promise<Conversation | null> {
    return storage.getConversation(id);
  }

  async createConversation(title?: string): Promise<Conversation> {
    const id = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newConv: Conversation = {
      id,
      title: title || 'New Business Consultation',
      messages: [],
      businessContext: null,
      consultationPlan: null,
      finalReport: null,
      dashboardState: orchestrationService.createInitialDashboardState(),
      createdAt: now,
      updatedAt: now
    };

    return storage.saveConversation(newConv);
  }

  async renameConversation(id: string, title: string): Promise<Conversation | null> {
    return storage.renameConversation(id, title);
  }

  async deleteConversation(id: string): Promise<boolean> {
    return storage.deleteConversation(id);
  }

  async processUserMessage(conversationId: string, text: string): Promise<{
    conversation: Conversation;
    assistantMessage: Message;
    readyForRun: boolean;
  }> {
    const conv = await storage.getConversation(conversationId);
    if (!conv) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    const now = new Date().toISOString();

    // 1. Append user message
    const userMsg: Message = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: now
    };
    conv.messages.push(userMsg);

    // 2. Extract structured business context using AI Manager
    const updatedContext = aiManagerService.extractBusinessContext(text, conv.businessContext);
    conv.businessContext = updatedContext;

    // Auto-update conversation title if it's the initial message
    if (conv.messages.length <= 2 && updatedContext.businessName) {
      conv.title = updatedContext.businessName;
    }

    // 3. Check for clarification vs ready to plan
    const clarification = aiManagerService.generateClarificationQuestion(updatedContext);

    let assistantMsg: Message;
    let readyForRun = false;

    if (clarification) {
      // Need clarification on essential fields (never invent info!)
      assistantMsg = {
        id: `msg_a_${Date.now()}`,
        role: 'assistant',
        content: clarification,
        timestamp: new Date().toISOString(),
        meta: {
          type: 'clarification',
          businessContextSnapshot: updatedContext
        }
      };
      conv.dashboardState.manager = {
        status: 'Planning',
        currentAction: 'Awaiting essential business parameters from entrepreneur',
        lastUpdated: new Date().toISOString()
      };
    } else {
      // Essential parameters are present! Ready to orchestrate.
      readyForRun = true;
      const budgetDisplay = updatedContext.initialInvestment.formatted 
        ? updatedContext.initialInvestment.formatted 
        : 'To be estimated by Finance Specialist';

      const planSummary = 
`I have analyzed your business idea and extracted the initial consultation parameters:

• **Business Type:** ${updatedContext.businessType}
• **Industry:** ${updatedContext.industry}
• **Proposed Location:** ${updatedContext.location}
• **Target Demographics:** ${updatedContext.targetCustomers}
• **Capital Budget:** ${budgetDisplay}
• **Timeline:** ${updatedContext.timeline}
${updatedContext.constraintsAndPreferences.length ? `• **Key Preferences:** ${updatedContext.constraintsAndPreferences.join(', ')}\n` : ''}
Everything essential is in place! I am ready to dispatch our three independent specialist agents (**Market Research**, **Marketing Strategy**, and **Finance Modeling**) to conduct your feasibility evaluation and generate your structured business plan.`;

      assistantMsg = {
        id: `msg_a_${Date.now()}`,
        role: 'assistant',
        content: planSummary,
        timestamp: new Date().toISOString(),
        meta: {
          type: 'plan_ready',
          businessContextSnapshot: updatedContext,
          suggestedActions: ['Start Consultation Workflow', 'Edit Parameters']
        }
      };

      conv.dashboardState.manager = {
        status: 'Planning',
        currentAction: `Structured plan ready for ${updatedContext.businessName}. Awaiting execution trigger.`,
        lastUpdated: new Date().toISOString()
      };
    }

    conv.messages.push(assistantMsg);
    await storage.saveConversation(conv);

    return {
      conversation: conv,
      assistantMessage: assistantMsg,
      readyForRun
    };
  }
}

export const conversationService = new ConversationService();
