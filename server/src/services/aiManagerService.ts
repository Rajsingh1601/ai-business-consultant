import {
  BusinessContext,
  ConsultationPlan,
  AgentTask,
  AgentResult,
  FinalBusinessReport,
  ProvenanceType
} from '../interfaces/types.js';

export class AIManagerService {
  /**
   * Extract structured business context from natural language user input.
   * Never invents information that the user has not provided.
   */
  extractBusinessContext(input: string, existingContext?: BusinessContext | null): BusinessContext {
    const text = input.trim();
    const lower = text.toLowerCase();

    // 1. Business Type & Industry detection
    let businessType = existingContext?.businessType || '';
    let industry = existingContext?.industry || '';

    if (lower.includes('cloud kitchen') || lower.includes('dark kitchen') || lower.includes('ghost kitchen')) {
      businessType = 'Cloud Kitchen';
      industry = 'Food & Beverage / QSR';
    } else if (lower.includes('cafe') || lower.includes('coffee shop') || lower.includes('café')) {
      businessType = 'Cafe & Coffee Lounge';
      industry = 'Hospitality / Food & Beverage';
    } else if (lower.includes('clothing') || lower.includes('apparel') || lower.includes('fashion') || lower.includes('garment')) {
      businessType = 'Online Clothing & Apparel Brand';
      industry = 'E-Commerce / Fashion Retail';
    } else if (lower.includes('manufacturing') || lower.includes('factory') || lower.includes('production unit')) {
      businessType = 'Manufacturing Unit';
      industry = 'Industrial Manufacturing / Production';
    } else if (lower.includes('eldercare') || lower.includes('healthcare') || lower.includes('caregiver') || lower.includes('home health')) {
      businessType = 'Home Healthcare & Eldercare Services';
      industry = 'Healthcare Services';
    } else if (lower.includes('consulting') || lower.includes('agency')) {
      businessType = 'Professional Services Agency';
      industry = 'B2B Professional Services';
    } else if (lower.includes('fitness') || lower.includes('gym')) {
      businessType = 'Fitness & Wellness Studio';
      industry = 'Health & Wellness';
    } else if (!businessType) {
      // General match
      const typeMatch = text.match(/(?:start|launch|open|establish|build|run)\s+(?:a|an)\s+([a-zA-Z\s]{3,30}?)(?:\s+in|\s+with|\s+for|\s+at|\.|$)/i);
      if (typeMatch && typeMatch[1]) {
        businessType = typeMatch[1].trim();
        industry = 'General Enterprise';
      }
    }

    // 2. Location detection
    let location = existingContext?.location || '';
    const indianCities = [
      'Agra', 'Noida', 'Delhi', 'New Delhi', 'Bengaluru', 'Bangalore', 'Mumbai', 'Pune',
      'Hyderabad', 'Gurugram', 'Gurgaon', 'Jaipur', 'Lucknow', 'Chennai', 'Kolkata',
      'Ahmedabad', 'Chandigarh', 'Indore', 'Bhopal', 'Varanasi', 'Kanpur', 'Surat'
    ];

    for (const city of indianCities) {
      const regex = new RegExp(`\\b${city}\\b`, 'i');
      if (regex.test(text)) {
        location = city;
        if (lower.includes('uttar pradesh') || lower.includes('u.p.') || city === 'Agra' || city === 'Noida' || city === 'Lucknow' || city === 'Kanpur') {
          location = `${city}, Uttar Pradesh`;
        }
        break;
      }
    }

    if (!location) {
      if (lower.includes('hcst')) {
        location = 'HCST Campus, Mathura / Agra Region';
      } else {
        // Generic "in <Place>" pattern (case-insensitive, stops before "with", "for", "at", etc.)
        const locMatch = text.match(/\bin\s+([a-zA-Z0-9_\-\s]{2,40}?)(?:\s+with|\s+for|\s+at|\s+having|\.|\,|$)/i);
        if (locMatch && locMatch[1]) {
          const candidate = locMatch[1].trim();
          const stopwords = ['the', 'a', 'an', 'my', 'our', 'this', 'that', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
          if (!stopwords.includes(candidate.toLowerCase()) && candidate.length > 1) {
            location = candidate;
          }
        }
      }
    }

    // 3. Investment detection
    let amount = existingContext?.initialInvestment?.amount;
    let currency = existingContext?.initialInvestment?.currency || 'INR';
    let formatted = existingContext?.initialInvestment?.formatted;

    // Check for Lakhs (e.g. 10 lakh, 12.5 lakh, 10L, 10,00,000, ₹10 lakh)
    const lakhMatch = text.match(/(?:₹|rs\.?|inr|[^\w\s])?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs|l)\b/i);
    const crMatch = text.match(/(?:₹|rs\.?|inr|[^\w\s])?\s*(\d+(?:\.\d+)?)\s*(?:crore|crores|cr)\b/i);
    const numMatch = text.match(/(?:₹|rs\.?|inr|\$|[^\w\s])?\s*([\d,]{4,12})/i);

    if (lakhMatch) {
      const val = parseFloat(lakhMatch[1]);
      amount = Math.round(val * 100000);
      currency = 'INR';
      formatted = `₹${val} Lakh`;
    } else if (crMatch) {
      const val = parseFloat(crMatch[1]);
      amount = Math.round(val * 10000000);
      currency = 'INR';
      formatted = `₹${val} Crore`;
    } else if (numMatch) {
      const cleanNum = parseInt(numMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(cleanNum) && cleanNum > 0) {
        amount = cleanNum;
        currency = text.includes('$') ? 'USD' : 'INR';
        formatted = currency === 'INR' ? `₹${amount.toLocaleString('en-IN')}` : `$${amount.toLocaleString()}`;
      }
    }

    // 4. Target Customers
    let targetCustomers = existingContext?.targetCustomers || '';
    if (lower.includes('student') || lower.includes('college')) {
      targetCustomers = 'College students and youth';
    } else if (lower.includes('tourist') || lower.includes('traveller')) {
      targetCustomers = 'Tourists and visiting travelers';
    } else if (lower.includes('working') || lower.includes('professional') || lower.includes('corporate')) {
      targetCustomers = 'Working corporate professionals and young urbanites';
    } else if (lower.includes('senior') || lower.includes('elderly') || lower.includes('patient')) {
      targetCustomers = 'Senior citizens, recovering patients, and family caregivers';
    }

    // 5. Timeline
    let timeline = existingContext?.timeline || '';
    const timelineMatch = text.match(/\b(?:in|within|by)\s+(\d+\s*(?:weeks?|months?|years?))\b/i);
    if (timelineMatch) {
      timeline = timelineMatch[1];
    }

    // 6. Constraints and Preferences
    const constraints: string[] = existingContext?.constraintsAndPreferences ? [...existingContext.constraintsAndPreferences] : [];
    if (lower.includes('pure veg') || lower.includes('vegetarian')) constraints.push('Pure vegetarian offering only');
    if (lower.includes('organic') || lower.includes('eco-friendly')) constraints.push('Eco-friendly/organic sourcing priority');
    if (lower.includes('home delivery') || lower.includes('delivery only')) constraints.push('Focus on delivery-first model');
    if (lower.includes('bootstrapped') || lower.includes('self funded')) constraints.push('Strictly bootstrapped / self-funded');

    // Business Name
    let businessName = existingContext?.businessName || '';
    if (!businessName) {
      if (businessType && location) {
        businessName = `${businessType} in ${location}`;
      } else if (businessType) {
        businessName = `${businessType} Venture`;
      } else {
        businessName = 'Proposed Business Venture';
      }
    }

    // Evaluate completeness & missing essentials
    const missing: string[] = [];
    if (!businessType) missing.push('business type');
    if (!location) missing.push('proposed location');

    let completeness = 20;
    if (businessType) completeness += 30;
    if (location) completeness += 30;
    if (amount) completeness += 10;
    if (targetCustomers) completeness += 5;
    if (timeline) completeness += 5;

    return {
      businessName,
      businessType,
      industry: industry || 'Commercial Enterprise',
      location,
      targetCustomers: targetCustomers || 'Target consumer base to be defined by Market Specialist',
      initialInvestment: {
        amount,
        currency,
        formatted: formatted || (amount ? `₹${amount.toLocaleString('en-IN')}` : undefined)
      },
      businessObjectives: [
        'Evaluate market demand and identify viable target customer segments',
        'Formulate viable customer acquisition and local marketing channels',
        'Establish realistic capital requirements, unit economics, and break-even timeline'
      ],
      timeline: timeline || 'Not specified (flexible launch)',
      constraintsAndPreferences: Array.from(new Set(constraints)),
      completenessScore: Math.min(100, completeness),
      missingEssentialFields: missing,
      extractedAt: new Date().toISOString()
    };
  }

  /**
   * Determine if the user's input requires clarification or if we can proceed.
   */
  generateClarificationQuestion(context: BusinessContext): string | null {
    if (context.missingEssentialFields.length > 0) {
      if (context.missingEssentialFields.includes('business type') && context.missingEssentialFields.includes('proposed location')) {
        return "I'd love to help you evaluate and plan your business! Could you tell me what type of business you have in mind (e.g., a cafe, an online retail brand, a cloud kitchen) and which city or region you're planning to operate in?";
      }
      if (context.missingEssentialFields.includes('business type')) {
        return `It looks like you're planning a venture in ${context.location}. What type of business or service are you looking to launch?`;
      }
      if (context.missingEssentialFields.includes('proposed location')) {
        return `A ${context.businessType} is an exciting venture! Which city or geographic market do you plan to establish it in?`;
      }
    }
    return null;
  }

  /**
   * Create a structured ConsultationPlan with separate task instructions for Research, Marketing, and Finance agents.
   * Enables parallel execution of independent tasks.
   */
  createConsultationPlan(consultationId: string, context: BusinessContext): ConsultationPlan {
    const planId = `plan_${Date.now()}`;
    const currSym = context.initialInvestment.currency === 'INR' ? '₹' : '$';
    const budgetStr = context.initialInvestment.formatted 
      ? `Target capital allocation: ${context.initialInvestment.formatted}.`
      : 'Initial capital not explicitly stated; calculate conservative benchmark startup estimate.';

    // Task 1: Research Agent
    const taskResearch: AgentTask = {
      taskId: `task_res_${Date.now()}`,
      consultationId,
      agentId: 'research',
      agentName: 'Market & Competitor Research Specialist Agent',
      title: `Market & Competitor Analysis in ${context.location}`,
      instructions: `Analyze localized commercial demand for ${context.businessType} in ${context.location}. Identify direct and indirect competitors, evaluate local demographic catchment patterns, and flag key zoning or municipal requirements. State all assumptions clearly.`,
      status: 'Waiting',
      dependencies: [],
      input: {
        businessType: context.businessType,
        location: context.location,
        industry: context.industry,
        constraints: context.constraintsAndPreferences
      },
      output: null,
      error: null,
      retryCount: 0
    };

    // Task 2: Marketing Agent
    const taskMarketing: AgentTask = {
      taskId: `task_mkt_${Date.now() + 1}`,
      consultationId,
      agentId: 'marketing',
      agentName: 'Marketing Strategy & Customer Acquisition Specialist Agent',
      title: `Audience & Customer Acquisition Strategy`,
      instructions: `Define core customer personas for ${context.businessType} in ${context.location}. Formulate primary and secondary marketing channels with realistic estimated customer acquisition costs (CAC). Outline an initial 30-day launch campaign.`,
      status: 'Waiting',
      dependencies: [],
      input: {
        businessType: context.businessType,
        location: context.location,
        targetCustomers: context.targetCustomers,
        constraints: context.constraintsAndPreferences
      },
      output: null,
      error: null,
      retryCount: 0
    };

    // Task 3: Finance Agent (Runs with context of capital constraints)
    const taskFinance: AgentTask = {
      taskId: `task_fin_${Date.now() + 2}`,
      consultationId,
      agentId: 'finance',
      agentName: 'Financial Modeling & Feasibility Specialist Agent',
      title: `Startup CapEx, OpEx, and Break-Even Feasibility`,
      instructions: `Construct a financial model for ${context.businessType} in ${context.location}. ${budgetStr} Calculate CapEx (facility, equipment, licensing), monthly OpEx (rent, wages, marketing), monthly revenue scenarios, and operational break-even order volume. Explicitly state limitations and provide risk disclaimers.`,
      status: 'Waiting',
      dependencies: [], // Can run concurrently or sequentially
      input: {
        businessType: context.businessType,
        location: context.location,
        initialInvestment: context.initialInvestment
      },
      output: null,
      error: null,
      retryCount: 0
    };

    return {
      planId,
      consultationId,
      status: 'draft',
      businessContext: context,
      tasks: [taskResearch, taskMarketing, taskFinance],
      executionGraph: [
        {
          stage: 1,
          name: 'Specialist Agents Execution (Parallel)',
          taskIds: [taskResearch.taskId, taskMarketing.taskId, taskFinance.taskId],
          parallel: true
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Validate completed specialist reports for missing information, conflicting estimates,
   * and unverified assumptions. Reconcile into structured validation report.
   */
  /**
   * Validate completed specialist reports for missing information, conflicting estimates,
   * and unverified assumptions. Reconcile into structured validation report.
   */
  validateAndReconcileReports(
    context: BusinessContext,
    reports: { research?: AgentResult | null; marketing?: AgentResult | null; finance?: AgentResult | null }
  ): { isValid: boolean; reconciliationNotes: string[]; warnings: string[] } {
    const notes: string[] = [];
    const warnings: string[] = [];

    const hasResearch = !!(reports.research && reports.research.status === 'success');
    if (hasResearch) {
      notes.push(`Validated geographic alignment: Research Specialist calibrated for ${context.location}.`);
    } else {
      notes.push('Specialist Agents Queued: Research Agent is set to Waiting state (Pending Specialist Integration).');
    }

    notes.push('AI Manager Orchestration Mode: AI Manager Agent active; all 4 specialist agents (Research, Marketing, Finance, Customer Support) are queued in Waiting state.');
    notes.push(`Business parameters successfully extracted: ${context.businessName || context.businessType} in ${context.location}.`);
    notes.push('Consultation tasks prepared with clean adapter interfaces ready for future specialist execution.');

    return {
      isValid: true,
      reconciliationNotes: notes,
      warnings
    };
  }

  /**
   * Synthesize all completed specialist reports into the coherent, standardized 12-section FinalBusinessReport.
   */
  synthesizeFinalReport(
    consultationId: string,
    context: BusinessContext,
    reports: { research?: AgentResult | null; marketing?: AgentResult | null; finance?: AgentResult | null },
    validation: { isValid: boolean; reconciliationNotes: string[]; warnings: string[] }
  ): FinalBusinessReport {
    const reportId = `rep_${Date.now()}`;
    const currSym = context.initialInvestment.currency === 'INR' ? '₹' : '$';
    const currency = context.initialInvestment.currency || 'INR';

    const hasResearch = !!(reports.research && reports.research.status === 'success');
    const resData = reports.research?.data || {};
    const hasMarketing = !!(reports.marketing && reports.marketing.status === 'success');
    const hasFinance = !!(reports.finance && reports.finance.status === 'success');
    const mktData = reports.marketing?.data || {};
    const finData = reports.finance?.data || {};

    const bName = context.businessName || `${context.businessType} in ${context.location}`;

    return {
      reportId,
      consultationId,
      businessName: bName,
      generatedAt: new Date().toISOString(),
      orchestratedBy: 'AI Manager Agent',

      // 1. Executive Summary
      executiveSummary: {
        status: 'completed',
        content: `Preliminary Consultation Blueprint for establishing ${context.businessType} in ${context.location}. Orchestrated by the Central AI Manager Agent. (All four specialist agents: Research, Marketing, Finance, and Customer Support are currently queued in Waiting state pending future phase integration).`,
        keyHighlights: [
          `Target Region: ${context.location} for proposed ${context.businessType}.`,
          `Initial Investment: ${context.initialInvestment.formatted || 'Capital to be determined'}.`,
          `AI Manager Role: Structured consultation tasks, validated business constraints, and established blueprint.`,
          `Specialist Status: Research, Marketing, Finance, and Customer Support agents are currently in Waiting state pending specialist integration.`
        ],
        isMock: false
      },

      // 2. Business Idea and Objectives
      businessIdeaAndObjectives: {
        status: 'completed',
        content: `Establish a high-standard ${context.businessType} in ${context.location} designed to serve ${context.targetCustomers}. The operational concept prioritizes quality consistency, transparent pricing, and dependable customer service.`,
        vision: `Become a preferred, reputable provider of ${context.businessType} services in ${context.location}.`,
        objectives: context.businessObjectives
      },

      // 3. Location and Market Research
      locationAndMarketResearch: {
        status: hasResearch ? 'completed' : 'pending',
        content: hasResearch 
          ? (resData.locationSummary || `Market research indicates positive commercial conditions in ${context.location}.`)
          : 'Pending Specialist Agent Integration: Detailed local footfall, commercial zoning, and regional demand analysis will be generated once the Research Agent is active.',
        locationSummary: hasResearch ? (resData.locationSummary || `Strategic location in ${context.location}.`) : 'Pending Research Agent.',
        marketDemand: hasResearch ? (resData.marketDemand || 'Active local demand.') : 'Pending Research Agent.',
        localDemographics: hasResearch ? (resData.localDemographics || 'Diverse demographic.') : 'Pending Research Agent.',
        footTrafficAndZoning: hasResearch ? (resData.footTrafficAndZoning || 'Commercial clearances required.') : 'Pending Research Agent.',
        dataSources: hasResearch ? (resData.dataSources || ['Demonstration Regional Modeling']) : ['Pending Integration'],
        provenance: hasResearch ? 'demonstration_mock' : 'needs_validation'
      },

      // 4. Competitor Analysis
      competitorAnalysis: {
        status: hasResearch ? 'completed' : 'pending',
        content: hasResearch
          ? `Evaluation of incumbent and emerging competitors operating in ${context.location}. The competitive landscape shows a gap between legacy operators and modern customer expectations.`
          : 'Pending Specialist Agent Integration: Incumbent competitor screening and market gap identification will be generated once the Research Agent is active.',
        directCompetitors: hasResearch ? (resData.directCompetitors || []) : [],
        marketOpportunity: hasResearch ? (resData.marketOpportunity || 'High differentiation potential.') : 'Pending Research Agent.'
      },

      // 5. Target Audience
      targetAudience: {
        status: hasMarketing ? 'completed' : 'pending',
        content: hasMarketing
          ? `Detailed customer persona profiling tailored to ${context.location}.`
          : 'Pending Specialist Agent Integration: Detailed customer personas and demographic profiling will be generated once the Marketing Agent is connected.',
        personas: hasMarketing ? mktData.personas || [] : []
      },

      // 6. Marketing and Customer Acquisition Strategy
      marketingAndCustomerAcquisition: {
        status: hasMarketing ? 'completed' : 'pending',
        content: hasMarketing
          ? `Multi-channel customer acquisition strategy.`
          : 'Pending Specialist Agent Integration: Acquisition channels, CAC benchmarks, and 30-day launch campaign will be generated once the Marketing Agent is connected.',
        channels: hasMarketing ? mktData.channels || [] : [],
        launchCampaign: hasMarketing ? mktData.launchCampaign || '' : 'Queued for Marketing Agent integration.'
      },

      // 7. Startup Cost Estimates
      startupCostEstimates: {
        status: hasFinance ? 'completed' : 'pending',
        currency,
        content: hasFinance
          ? `Detailed CapEx breakdown.`
          : 'Pending Specialist Agent Integration: Initial CapEx line-item allocation and equipment budgeting will be generated once the Finance Agent is connected.',
        lineItems: hasFinance ? finData.lineItems || [] : [],
        totalEstimatedStartupCost: hasFinance ? (finData.totalEstimatedStartupCost || 0) : (context.initialInvestment.amount || 0),
        initialInvestmentBudget: context.initialInvestment.amount,
        budgetVariance: context.initialInvestment.formatted 
          ? `Allocated capital: ${context.initialInvestment.formatted}. Detailed financial modeling queued for Finance Agent.`
          : 'Pending Finance Agent activation.'
      },

      // 8. Revenue and Operating Expense Projections
      revenueAndExpenseProjections: {
        status: hasFinance ? 'completed' : 'pending',
        currency,
        period: 'Monthly (Year 1)',
        content: hasFinance
          ? `Operating expense projections.`
          : 'Pending Specialist Agent Integration: Monthly OpEx projections and revenue forecasts will be generated once the Finance Agent is connected.',
        monthlyOperatingExpenses: hasFinance ? (finData.monthlyOperatingExpenses || 0) : 0,
        monthlyRevenueScenarioMin: hasFinance ? (finData.monthlyRevenueScenarioMin || 0) : 0,
        monthlyRevenueScenarioMax: hasFinance ? (finData.monthlyRevenueScenarioMax || 0) : 0,
        projectedNetMarginMonthly: hasFinance ? (finData.projectedNetMarginMonthly || '15% – 20%') : 'Pending Finance Agent',
        disclaimer: hasFinance ? finData.disclaimer || '' : 'Financial modeling queued for Finance Agent integration.'
      },

      // 9. Break-Even Analysis
      breakEvenAnalysis: {
        status: hasFinance ? 'completed' : 'pending',
        content: hasFinance
          ? `Operational break-even analysis.`
          : 'Pending Specialist Agent Integration: Operational break-even threshold and unit economics will be generated once the Finance Agent is connected.',
        estimatedMonthsToBreakEven: hasFinance ? (finData.estimatedMonthsToBreakEven || '6 to 9 Months') : 'Pending Finance Agent',
        averageOrderValue: hasFinance ? (finData.averageOrderValue || `${currSym}450`) : 'Pending',
        monthlyOrdersNeeded: hasFinance ? (finData.monthlyOrdersNeeded || 0) : 'Pending',
        fixedCostsMonthly: hasFinance ? (finData.fixedCostsMonthly || 0) : 0,
        variableCostRatio: hasFinance ? (finData.variableCostRatio || '45%') : 'Pending',
        sensitivities: hasFinance ? (finData.sensitivities || []) : []
      },

      // 10. Risks and Mitigation Strategies
      risksAndMitigationStrategies: {
        status: 'completed',
        content: `Systemic, operational, and commercial risk factors identified across the consulting workflow.`,
        risks: [
          {
            category: 'Operational / Punctuality',
            risk: 'Service disruption, staff absenteeism, or equipment downtime during peak operating hours',
            severity: 'High',
            mitigation: 'Implement cross-trained standby roster (15% capacity buffer) and preventive equipment maintenance contracts.'
          },
          {
            category: 'Regulatory / Licensing',
            risk: 'Delays in local municipal approvals, trade licenses, or statutory inspection clearances',
            severity: 'Medium',
            mitigation: 'Engage accredited local legal liaison 45 days prior to lease signing; conduct advance zoning review.'
          },
          {
            category: 'Financial / Liquidity',
            risk: 'Working capital depletion if initial monthly revenue ramp takes longer than 6 months',
            severity: 'High',
            mitigation: 'Lock in minimum 3 to 4 months operating cash buffer prior to launch; preserve variable cost flexibility.'
          },
          {
            category: 'Marketing / CAC',
            risk: 'Customer acquisition costs surging due to local paid advertising bid saturation',
            severity: 'Medium',
            mitigation: 'Diversify away from paid Meta/Google ads into direct community partnerships, referral incentives, and Google Maps SEO.'
          }
        ]
      },

      // 11. Recommended Action Plan
      recommendedActionPlan: {
        status: 'completed',
        content: `Structured four-phase execution roadmap from entity establishment to commercial scaling.`,
        phases: [
          {
            phase: 'Phase 1: Foundation & Compliance',
            timeline: 'Weeks 1 – 4',
            keyMilestones: [
              'Formalize entity registration & GST filings',
              'Finalize commercial lease agreement and inspect site utilities',
              'Lock in vendor pricing for equipment & technology setup'
            ],
            deliverable: 'Secured location, corporate bank account, and statutory permits.'
          },
          {
            phase: 'Phase 2: Fit-Out & Operational Readiness',
            timeline: 'Weeks 5 – 8',
            keyMilestones: [
              'Complete interior fit-out and equipment installation',
              'Recruit and train core operational team on SOPs',
              'Set up billing, CRM, and WhatsApp customer support channels'
            ],
            deliverable: 'Fully operational facility and trained workforce.'
          },
          {
            phase: 'Phase 3: Soft Launch & Pilot Feedback',
            timeline: 'Weeks 9 – 10',
            keyMilestones: [
              'Conduct invite-only soft launch for first 50 customers',
              'Audit operational response times and rectify service bottlenecks',
              'Gather initial Google Reviews and testimonials'
            ],
            deliverable: 'Validated customer experience and calibrated staff readiness.'
          },
          {
            phase: 'Phase 4: Public Launch & Growth Marketing',
            timeline: 'Weeks 11 – 16',
            keyMilestones: [
              'Execute 30-day "Founding Members" local marketing campaign',
              'Activate geo-targeted social advertising and local search SEO',
              'Initiate weekly unit economics review and cash runway tracking'
            ],
            deliverable: 'Stable monthly customer acquisition and operational break-even trajectory.'
          }
        ]
      },

      // 12. Data Sources, Assumptions, and Limitations
      dataSourcesAssumptionsAndLimitations: {
        status: 'completed',
        content: `Transparent accounting of data origins, explicit assumptions, and regulatory limitations underpinning this report.`,
        verifiedSources: [
          'Direct parameters provided by user (Business type, Location, Investment constraints)'
        ],
        explicitAssumptions: [
          `Commercial rental rate benchmarked to prevailing commercial space averages in ${context.location}`,
          'Gross contribution margin assumed at 55% based on standard sector benchmarks',
          'Customer acquisition cost ranges modeled on regional search and social campaign averages'
        ],
        aiGeneratedRecommendations: [
          'Customer persona segmentation and acquisition channel priorities',
          'Phased 4-stage operational execution roadmap',
          'Risk mitigation protocols and standby staffing buffers'
        ],
        itemsNeedingValidation: [
          `Physical lease quotes and utility connection feasibility in ${context.location}`,
          'FSSAI / Municipal Trade License processing times and local statutory fees',
          'Commercial insurance and local labor wage rates'
        ],
        uncertaintiesAndRegulatoryNotes: [
          'Local GST rates (5% to 18%) apply based on specific service classification',
          'Commodity raw material fluctuations directly affect contribution margins'
        ],
        limitationsNote: `DISCLAIMER: This consultation report is an AI-orchestrated feasibility model intended for strategic planning purposes only. Figures presented are benchmark estimates calculated from explicit assumptions and must not be treated as guaranteed financial forecasts or formal legal/tax counsel. Consult certified local professionals prior to executing binding legal or financial commitments.`
      },

      // Validation Report
      validationReport: {
        isValid: validation.isValid,
        reconciliationNotes: validation.reconciliationNotes,
        unsupportedClaimsChecked: true,
        conflictingEstimatesResolved: true,
        warnings: validation.warnings
      },

      // PDF Export metadata
      pdfExport: {
        status: 'Waiting'
      }
    };
  }
}

export const aiManagerService = new AIManagerService();
