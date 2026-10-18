import type { Conversation, AgentStatusDashboardState, FinalBusinessReport, ConsultationPlan, BusinessContext } from '../types';

const BASE_URL = '/api';

export const api = {
  async getConversations(query?: string): Promise<Conversation[]> {
    const url = query ? `${BASE_URL}/conversations?q=${encodeURIComponent(query)}` : `${BASE_URL}/conversations`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch conversations');
    return res.json();
  },

  async getConversation(id: string): Promise<Conversation> {
    const res = await fetch(`${BASE_URL}/conversations/${id}`);
    if (!res.ok) throw new Error('Failed to fetch conversation');
    return res.json();
  },

  async createConversation(title?: string): Promise<Conversation> {
    const res = await fetch(`${BASE_URL}/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    if (!res.ok) throw new Error('Failed to create conversation');
    return res.json();
  },

  async renameConversation(id: string, title: string): Promise<Conversation> {
    const res = await fetch(`${BASE_URL}/conversations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    if (!res.ok) throw new Error('Failed to rename conversation');
    return res.json();
  },

  async deleteConversation(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/conversations/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete conversation');
  },

  async sendMessage(conversationId: string, content: string) {
    const res = await fetch(`${BASE_URL}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  async runConsultation(conversationId: string) {
    const res = await fetch(`${BASE_URL}/consultations/${conversationId}/run`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to initiate consultation run');
    return res.json();
  },

  async retryTask(conversationId: string, taskId: string) {
    const res = await fetch(`${BASE_URL}/consultations/${conversationId}/retry/${taskId}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to retry task');
    return res.json();
  },

  async getStatus(conversationId: string): Promise<{
    dashboardState: AgentStatusDashboardState;
    plan: ConsultationPlan | null;
    finalReport: FinalBusinessReport | null;
    businessContext: BusinessContext | null;
  }> {
    const res = await fetch(`${BASE_URL}/consultations/${conversationId}/status`);
    if (!res.ok) throw new Error('Failed to fetch consultation status');
    return res.json();
  },

  subscribeEvents(conversationId: string, onUpdate: (data: any) => void): () => void {
    const eventSource = new EventSource(`${BASE_URL}/consultations/${conversationId}/events`);
    
    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        onUpdate(parsed);
      } catch (err) {
        console.error('Failed to parse SSE event:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn('SSE event stream warning/error:', err);
    };

    return () => {
      eventSource.close();
    };
  }
};
