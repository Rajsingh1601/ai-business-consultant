import { BaseSpecialistAgentAdapter } from './baseAgentAdapter.js';
import { AgentTask, AgentResult, BusinessContext } from '../interfaces/types.js';

export class FinanceAgentAdapter extends BaseSpecialistAgentAdapter {
  agentId = 'finance' as const;
  agentName = 'Financial Modeling & Feasibility Specialist Agent';
  isRealIntelligenceIntegrated = false; // Mock adapter placeholder ready for LLM integration

  async executeTask(
    task: AgentTask,
    context: BusinessContext,
    _previousResults?: Record<string, AgentResult>
  ): Promise<AgentResult> {
    const loc = context.location || 'Selected Region';
    const bType = context.businessType || 'Proposed Business';
    const currency = context.initialInvestment?.currency || 'INR';
    const currSymbol = currency === 'INR' ? '₹' : '$';

    // Base initial investment: use user's explicit amount or default to a reasonable baseline
    const userBudget = context.initialInvestment?.amount;
    const baseBudget = userBudget && userBudget > 0 ? userBudget : 1000000; // Default 10 Lakh INR

    // Dynamic scale factors based on investment amount
    const capexLeaseDeposit = Math.round(baseBudget * 0.15);
    const capexFitoutEquipment = Math.round(baseBudget * 0.35);
    const capexLicensingLegal = Math.round(baseBudget * 0.05);
    const capexTechnologyBrand = Math.round(baseBudget * 0.08);
    const workingCapitalReserve = Math.round(baseBudget * 0.37);

    const totalCalculatedStartup = capexLeaseDeposit + capexFitoutEquipment + capexLicensingLegal + capexTechnologyBrand + workingCapitalReserve;

    // Monthly Operating Expenses (OpEx)
    const rentMonthly = Math.round(baseBudget * 0.035);
    const payrollMonthly = Math.round(baseBudget * 0.065);
    const marketingMonthly = Math.round(baseBudget * 0.025);
    const utilitiesAndTechMonthly = Math.round(baseBudget * 0.015);
    const opexMonthly = rentMonthly + payrollMonthly + marketingMonthly + utilitiesAndTechMonthly;

    // Revenue Scenarios (Monthly)
    const revScenarioMin = Math.round(opexMonthly * 0.85); // Conservative initial ramp-up
    const revScenarioMax = Math.round(opexMonthly * 1.55); // Maturing monthly volume

    // Break-even estimation
    const avgTicket = currency === 'INR' ? 450 : 25;
    const grossMarginPercent = 0.55; // 55% contribution margin
    const fixedMonthlyCost = opexMonthly;
    const breakEvenRevenueMonthly = Math.round(fixedMonthlyCost / grossMarginPercent);
    const breakEvenOrdersMonthly = Math.round(breakEvenRevenueMonthly / avgTicket);

    // Simulate real asynchronous execution time
    await new Promise((r) => setTimeout(r, 1600));

    return {
      taskId: task.taskId,
      agentId: this.agentId,
      agentName: this.agentName,
      status: 'success',
      isMock: true,
      provenance: 'explicit_assumption',
      summary: `Completed initial financial feasibility framework and cash flow projections for ${bType} in ${loc} based on ${currSymbol}${baseBudget.toLocaleString('en-IN')} target capital. (Calculated demonstration estimates from explicit assumptions).`,
      reliabilityNotes: [
        `All figures are calculated estimates in ${currency} based on benchmark operational margins, not audited financial forecasts.`,
        'No guarantee of revenue, profit, or timeline to break-even is made or implied.',
        'Commercial lease security deposits, municipal licenses (FSSAI/Shops & Establishments/Fire NOC), and contractor quotes vary widely by specific micro-location in ' + loc + ' and must be verified with certified local professionals.',
        'Contingency working capital buffer of at least 3-6 months operating expenses is strongly recommended prior to operational commitment.'
      ],
      data: {
        currency,
        currencySymbol: currSymbol,
        initialInvestmentBudget: userBudget || undefined,
        totalEstimatedStartupCost: totalCalculatedStartup,
        lineItems: [
          {
            category: 'Facilities & Security Deposit',
            description: `Lease security deposit & initial rental advance for commercial space in ${loc}`,
            amount: capexLeaseDeposit,
            isEstimate: true,
            uncertaintyNote: 'Subject to commercial lease negotiations and specific street frontage.'
          },
          {
            category: 'Equipment, Machinery & Fit-Out',
            description: `Core operational fixtures, commercial kitchen/office equipment, basic interior setup`,
            amount: capexFitoutEquipment,
            isEstimate: true,
            uncertaintyNote: 'Vendor quotes and machinery lead times should be verified.'
          },
          {
            category: 'Statutory Licensing & Registrations',
            description: `Trade license, GST registration, local municipal permits, corporate entity incorporation`,
            amount: capexLicensingLegal,
            isEstimate: true,
            uncertaintyNote: 'Government statutory fees and local professional filing charges.'
          },
          {
            category: 'Brand Identity, Software & Digital Setup',
            description: `POS/ERP software subscription, domain/hosting, branding collateral, initial onboarding`,
            amount: capexTechnologyBrand,
            isEstimate: true,
            uncertaintyNote: 'Software costs depend on selected vendor tier.'
          },
          {
            category: 'Operating Reserve & Working Capital Buffer',
            description: `3 to 4 months of buffer covering raw materials, utility deposits, and baseline wages`,
            amount: workingCapitalReserve,
            isEstimate: true,
            uncertaintyNote: 'Critical safety buffer to prevent liquidity crunches during initial customer ramp.'
          }
        ],
        budgetVariance: userBudget
          ? `Allocated capital matches proposed budget of ${currSymbol}${userBudget.toLocaleString('en-IN')} with 37% apportioned to liquid working capital reserve.`
          : `Estimated baseline setup cost of ${currSymbol}${totalCalculatedStartup.toLocaleString('en-IN')} based on typical commercial benchmarks.`,
        monthlyOperatingExpenses: opexMonthly,
        monthlyOperatingBreakdown: {
          rent: rentMonthly,
          staffPayroll: payrollMonthly,
          marketingAndAcquisition: marketingMonthly,
          utilitiesAndSoftware: utilitiesAndTechMonthly
        },
        monthlyRevenueScenarioMin: revScenarioMin,
        monthlyRevenueScenarioMax: revScenarioMax,
        projectedNetMarginMonthly: '12% – 22% (Target operational steady-state)',
        disclaimer: `IMPORTANT FINANCIAL NOTICE: All financial estimates are non-binding operational models derived from standard industry heuristics and user-provided parameters. They do not constitute certified accounting, tax, or investment advice. Local statutory compliance, GST rates (5%–18%), depreciation, and inflation will alter real-world results.`,
        estimatedMonthsToBreakEven: '6 to 9 Months (Operational Break-Even)',
        averageOrderValue: `${currSymbol}${avgTicket}`,
        monthlyOrdersNeeded: breakEvenOrdersMonthly,
        fixedCostsMonthly: fixedMonthlyCost,
        variableCostRatio: '45% of gross revenue (Cost of Goods Sold & Direct Fulfillment)',
        sensitivities: [
          'Raw material / commodity price surges (+10% increase delays break-even by ~45 days)',
          'Commercial occupancy delay (each month of unutilized rent reduces cash runway by ~3.5%)',
          'Customer churn rate (requires consistent repeat order retention above 30%)'
        ]
      },
      generatedAt: new Date().toISOString()
    };
  }
}
