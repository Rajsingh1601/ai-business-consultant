export type ManagerStatus = 'Idle' | 'Planning' | 'Coordinating' | 'Reviewing' | 'Completed' | 'Failed';
export type SpecialistStatus = 'Waiting' | 'Running' | 'Completed' | 'Failed';
export type CustomerSupportStatus = 'Waiting' | 'Generating PDF' | 'Completed' | 'Failed';

export interface AgentStatusDashboardState {
  manager: {
    status: ManagerStatus;
    currentAction: string;
    lastUpdated: string;
  };
  research: {
    status: SpecialistStatus;
    taskId?: string;
    lastUpdated: string;
    error?: string | null;
  };
  marketing: {
    status: SpecialistStatus;
    taskId?: string;
    lastUpdated: string;
    error?: string | null;
  };
  finance: {
    status: SpecialistStatus;
    taskId?: string;
    lastUpdated: string;
    error?: string | null;
  };
  customerSupport: {
    status: CustomerSupportStatus;
    taskId?: string;
    lastUpdated: string;
    error?: string | null;
    pdfUrl?: string;
  };
}

export interface InitialInvestment {
  amount?: number;
  currency: string;
  formatted?: string;
}

export interface BusinessContext {
  businessName: string;
  businessType: string;
  industry: string;
  location: string;
  targetCustomers: string;
  initialInvestment: InitialInvestment;
  businessObjectives: string[];
  timeline: string;
  constraintsAndPreferences: string[];
  completenessScore: number;
  missingEssentialFields: string[];
  extractedAt: string;
}

export type ProvenanceType = 
  | 'real_data' 
  | 'explicit_assumption' 
  | 'ai_recommendation' 
  | 'demonstration_mock'
  | 'needs_validation';

export interface AgentResult {
  taskId: string;
  agentId: 'research' | 'marketing' | 'finance' | 'customer_support';
  agentName: string;
  status: 'success' | 'partial' | 'failed';
  summary: string;
  isMock: boolean;
  provenance: ProvenanceType;
  reliabilityNotes: string[];
  data: Record<string, any>;
  generatedAt: string;
  error?: string | null;
}

export interface AgentTask {
  taskId: string;
  consultationId: string;
  agentId: 'manager' | 'research' | 'marketing' | 'finance' | 'customer_support';
  agentName: string;
  title: string;
  instructions: string;
  status: SpecialistStatus;
  dependencies: string[];
  input: Record<string, any>;
  output: AgentResult | null;
  error: string | null;
  startedAt?: string;
  completedAt?: string;
  retryCount: number;
}

export interface ExecutionStage {
  stage: number;
  name: string;
  taskIds: string[];
  parallel: boolean;
}

export interface ConsultationPlan {
  planId: string;
  consultationId: string;
  status: 'draft' | 'executing' | 'completed' | 'failed';
  businessContext: BusinessContext;
  tasks: AgentTask[];
  executionGraph: ExecutionStage[];
  createdAt: string;
  updatedAt: string;
}

export interface FinalBusinessReport {
  reportId: string;
  consultationId: string;
  businessName: string;
  generatedAt: string;
  orchestratedBy: string;

  executiveSummary: {
    status: 'completed' | 'pending';
    content: string;
    keyHighlights: string[];
    isMock: boolean;
  };

  businessIdeaAndObjectives: {
    status: 'completed' | 'pending';
    content: string;
    vision: string;
    objectives: string[];
  };

  locationAndMarketResearch: {
    status: 'completed' | 'pending';
    content: string;
    locationSummary: string;
    marketDemand: string;
    localDemographics: string;
    footTrafficAndZoning: string;
    dataSources: string[];
    provenance: ProvenanceType;
  };

  competitorAnalysis: {
    status: 'completed' | 'pending';
    content: string;
    directCompetitors: Array<{
      name: string;
      strengths: string;
      weaknesses: string;
      pricePoint: string;
      positioning: string;
    }>;
    marketOpportunity: string;
  };

  targetAudience: {
    status: 'completed' | 'pending';
    content: string;
    personas: Array<{
      segment: string;
      demographics: string;
      painPoints: string;
      willingnessToPay: string;
      channels: string;
    }>;
  };

  marketingAndCustomerAcquisition: {
    status: 'completed' | 'pending';
    content: string;
    channels: Array<{
      channel: string;
      tactics: string;
      estimatedCac: string;
      priority: 'Primary' | 'Secondary' | 'Future';
    }>;
    launchCampaign: string;
  };

  startupCostEstimates: {
    status: 'completed' | 'pending';
    currency: string;
    content: string;
    lineItems: Array<{
      category: string;
      description: string;
      amount: number;
      isEstimate: boolean;
      uncertaintyNote?: string;
    }>;
    totalEstimatedStartupCost: number;
    initialInvestmentBudget?: number;
    budgetVariance: string;
  };

  revenueAndExpenseProjections: {
    status: 'completed' | 'pending';
    currency: string;
    period: string;
    content: string;
    monthlyOperatingExpenses: number;
    monthlyRevenueScenarioMin: number;
    monthlyRevenueScenarioMax: number;
    projectedNetMarginMonthly: string;
    disclaimer: string;
  };

  breakEvenAnalysis: {
    status: 'completed' | 'pending';
    content: string;
    estimatedMonthsToBreakEven: string;
    averageOrderValue: string;
    monthlyOrdersNeeded: number | string;
    fixedCostsMonthly: number;
    variableCostRatio: string;
    sensitivities: string[];
  };

  risksAndMitigationStrategies: {
    status: 'completed' | 'pending';
    content: string;
    risks: Array<{
      category: string;
      risk: string;
      severity: 'High' | 'Medium' | 'Low';
      mitigation: string;
    }>;
  };

  recommendedActionPlan: {
    status: 'completed' | 'pending';
    content: string;
    phases: Array<{
      phase: string;
      timeline: string;
      keyMilestones: string[];
      deliverable: string;
    }>;
  };

  dataSourcesAssumptionsAndLimitations: {
    status: 'completed' | 'pending';
    content: string;
    verifiedSources: string[];
    explicitAssumptions: string[];
    aiGeneratedRecommendations: string[];
    itemsNeedingValidation: string[];
    uncertaintiesAndRegulatoryNotes: string[];
    limitationsNote: string;
  };

  validationReport: {
    isValid: boolean;
    reconciliationNotes: string[];
    unsupportedClaimsChecked: boolean;
    conflictingEstimatesResolved: boolean;
    warnings: string[];
  };

  pdfExport: {
    status: CustomerSupportStatus;
    fileName?: string;
    filePath?: string;
    downloadUrl?: string;
    fileSizeBytes?: number;
    generatedAt?: string;
    error?: string | null;
  };
}

export interface MessageMeta {
  type?: 'text' | 'clarification' | 'plan_ready' | 'consultation_running' | 'consultation_completed' | 'report_generated';
  businessContextSnapshot?: BusinessContext;
  reportId?: string;
  planId?: string;
  tasksSnapshot?: AgentTask[];
  suggestedActions?: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  meta?: MessageMeta;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  businessContext: BusinessContext | null;
  consultationPlan: ConsultationPlan | null;
  finalReport: FinalBusinessReport | null;
  dashboardState: AgentStatusDashboardState;
  createdAt: string;
  updatedAt: string;
}
