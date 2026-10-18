import { AgentTask, AgentResult, BusinessContext } from '../interfaces/types.js';

export interface ISpecialistAgentAdapter {
  agentId: 'research' | 'marketing' | 'finance' | 'customer_support';
  agentName: string;
  isRealIntelligenceIntegrated: boolean;

  validateTaskInput(task: AgentTask): { valid: boolean; reason?: string };

  executeTask(
    task: AgentTask,
    context: BusinessContext,
    previousResults?: Record<string, AgentResult>
  ): Promise<AgentResult>;
}

export abstract class BaseSpecialistAgentAdapter implements ISpecialistAgentAdapter {
  abstract agentId: 'research' | 'marketing' | 'finance' | 'customer_support';
  abstract agentName: string;
  isRealIntelligenceIntegrated: boolean = false;

  validateTaskInput(task: AgentTask): { valid: boolean; reason?: string } {
    if (!task || !task.taskId) {
      return { valid: false, reason: 'Task object and taskId are required.' };
    }
    return { valid: true };
  }

  abstract executeTask(
    task: AgentTask,
    context: BusinessContext,
    previousResults?: Record<string, AgentResult>
  ): Promise<AgentResult>;
}
