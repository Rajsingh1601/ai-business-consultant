import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { FinalBusinessReport, CustomerSupportStatus } from '../interfaces/types.js';

export interface ReportGenerationResult {
  success: boolean;
  filePath: string;
  fileName: string;
  downloadUrl: string;
  fileSizeBytes: number;
  generatedAt: string;
  error?: string;
}

export interface ICustomerSupportAdapter {
  agentName: string;
  status: CustomerSupportStatus;
  generateReport(report: FinalBusinessReport, targetFileName?: string): Promise<ReportGenerationResult>;
}

export class CustomerSupportAgentAdapter implements ICustomerSupportAdapter {
  agentName = 'Customer Support Consulting & Documentation Agent';
  status: CustomerSupportStatus = 'Waiting';

  async generateReport(report: FinalBusinessReport, customFileName?: string): Promise<ReportGenerationResult> {
    this.status = 'Generating PDF';

    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const safeName = (report.businessName || 'Business_Plan')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 40);
    const fileName = customFileName || `${safeName}_Consulting_Report_${Date.now()}.pdf`;
    const outputPath = path.join(reportsDir, fileName);

    return new Promise<ReportGenerationResult>((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 45, bottom: 45, left: 45, right: 45 },
          bufferPages: true
        });

        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // Styling Palette
        const C_NAVY = '#0F172A';
        const C_BLUE = '#1E3A8A';
        const C_TEAL = '#0D9488';
        const C_DARK = '#1E293B';
        const C_MUTED = '#475569';
        const C_LIGHT = '#F8FAFC';
        const C_BORDER = '#CBD5E1';
        const C_WHITE = '#FFFFFF';
        const C_AMBER = '#B45309';

        const PAGE_WIDTH = 595.28;
        const PAGE_HEIGHT = 841.89;
        const MARGIN_LEFT = 45;
        const CONTENT_WIDTH = PAGE_WIDTH - 90;

        function ensureSpace(needed: number) {
          if (doc.y + needed > PAGE_HEIGHT - 55) {
            doc.addPage();
          }
        }

        function sectionHeading(num: number, title: string) {
          ensureSpace(55);
          doc.moveDown(0.8);
          const y = doc.y;
          doc.rect(MARGIN_LEFT, y, CONTENT_WIDTH, 24).fill('#F1F5F9');
          doc.rect(MARGIN_LEFT, y, 4, 24).fill(C_BLUE);
          doc.font('Helvetica-Bold').fontSize(11).fillColor(C_NAVY)
             .text(`${num}. ${title.toUpperCase()}`, MARGIN_LEFT + 12, y + 6);
          doc.y = y + 32;
        }

        // --- COVER PAGE ---
        doc.rect(0, 0, PAGE_WIDTH, 14).fill(C_BLUE);
        doc.rect(0, 14, PAGE_WIDTH, 4).fill(C_TEAL);
        doc.rect(MARGIN_LEFT, 65, 6, 80).fill(C_TEAL);

        doc.font('Helvetica-Bold').fontSize(20).fillColor(C_BLUE)
           .text('AI MULTI-AGENT VIRTUAL CONSULTING PLATFORM', MARGIN_LEFT + 16, 70);
        doc.font('Helvetica-Bold').fontSize(12).fillColor(C_TEAL)
           .text('AUTONOMOUS MULTI-AGENT BUSINESS FEASIBILITY & STRATEGY REPORT', MARGIN_LEFT + 16, 96);
        doc.font('Helvetica').fontSize(9).fillColor(C_MUTED)
           .text('Orchestrated by AI Manager Agent | Validated Multi-Specialist Synthesis', MARGIN_LEFT + 16, 116);

        // Title Card
        doc.rect(MARGIN_LEFT, 175, CONTENT_WIDTH, 115).fill(C_LIGHT);
        doc.rect(MARGIN_LEFT, 175, CONTENT_WIDTH, 115).stroke(C_BORDER);
        doc.rect(MARGIN_LEFT, 175, 6, 115).fill(C_BLUE);

        doc.font('Helvetica-Bold').fontSize(16).fillColor(C_NAVY)
           .text(report.businessName.toUpperCase(), MARGIN_LEFT + 20, 195);
        doc.font('Helvetica-Bold').fontSize(12).fillColor(C_TEAL)
           .text('Comprehensive Strategic & Financial Feasibility Blueprint', MARGIN_LEFT + 20, 220);
        doc.font('Helvetica-Oblique').fontSize(9).fillColor(C_MUTED)
           .text(`Document Reference: ${report.reportId} | Generated: ${new Date(report.generatedAt).toLocaleString()}`, MARGIN_LEFT + 20, 245);

        // Metadata table
        const metaY = 315;
        doc.rect(MARGIN_LEFT, metaY, CONTENT_WIDTH, 140).stroke(C_BORDER);
        doc.rect(MARGIN_LEFT, metaY, CONTENT_WIDTH, 22).fill(C_NAVY);
        doc.font('Helvetica-Bold').fontSize(9).fillColor(C_WHITE)
           .text('CONSULTATION SPECIFICATION & AUDIT TRAIL', MARGIN_LEFT + 10, metaY + 6);

        const metaRows = [
          ['Venture / Concept:', report.businessName],
          ['Lead Orchestrator:', 'Central AI Manager Agent'],
          ['Specialist Agents:', 'Research Agent, Marketing Agent, Finance Agent'],
          ['Customer Support Division:', 'Customer Support Agent (PDF & Delivery Engine)'],
          ['Validation Status:', report.validationReport.isValid ? 'Reconciled & Formally Validated' : 'Provisional Synthesis'],
          ['Data Reliability Level:', 'Explicit Assumptions & Demonstration Synthesis (Field Verification Required)']
        ];

        let curY = metaY + 28;
        metaRows.forEach(([k, v], idx) => {
          if (idx % 2 === 1) {
            doc.rect(MARGIN_LEFT + 1, curY - 2, CONTENT_WIDTH - 2, 16).fill('#F8FAFC');
          }
          doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_DARK).text(k, MARGIN_LEFT + 10, curY, { width: 150 });
          doc.font('Helvetica').fontSize(8.5).fillColor(C_MUTED).text(v, MARGIN_LEFT + 165, curY, { width: CONTENT_WIDTH - 175 });
          curY += 17;
        });

        // 1. Executive Summary
        doc.y = 485;
        sectionHeading(1, 'Executive Summary');
        doc.font('Helvetica').fontSize(9).fillColor(C_DARK)
           .text(report.executiveSummary.content, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH, lineGap: 3 });

        if (report.executiveSummary.keyHighlights?.length) {
          doc.moveDown(0.5);
          doc.font('Helvetica-Bold').fontSize(9).fillColor(C_BLUE).text('Strategic Highlights:');
          report.executiveSummary.keyHighlights.forEach((hl) => {
            ensureSpace(16);
            doc.font('Helvetica').fontSize(8.5).fillColor(C_DARK)
               .text(`• ${hl}`, MARGIN_LEFT + 10, doc.y + 2, { width: CONTENT_WIDTH - 15 });
          });
        }

        // 2. Business Idea and Objectives
        sectionHeading(2, 'Business Idea and Objectives');
        doc.font('Helvetica').fontSize(9).fillColor(C_DARK)
           .text(report.businessIdeaAndObjectives.content, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH, lineGap: 3 });
        if (report.businessIdeaAndObjectives.objectives?.length) {
          doc.moveDown(0.4);
          doc.font('Helvetica-Bold').fontSize(9).fillColor(C_BLUE).text('Key Objectives:');
          report.businessIdeaAndObjectives.objectives.forEach((obj) => {
            ensureSpace(16);
            doc.font('Helvetica').fontSize(8.5).fillColor(C_DARK)
               .text(`• ${obj}`, MARGIN_LEFT + 10, doc.y + 2, { width: CONTENT_WIDTH - 15 });
          });
        }

        // 3. Location and Market Research
        sectionHeading(3, 'Location and Market Research');
        doc.font('Helvetica').fontSize(9).fillColor(C_DARK)
           .text(report.locationAndMarketResearch.content, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH, lineGap: 3 });
        doc.moveDown(0.3);
        doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_BLUE).text('Market Demand & Demographics: ', { continued: true });
        doc.font('Helvetica').fontSize(8.5).fillColor(C_MUTED).text(report.locationAndMarketResearch.marketDemand);

        // 4. Competitor Analysis
        sectionHeading(4, 'Competitor Analysis');
        doc.font('Helvetica').fontSize(9).fillColor(C_DARK)
           .text(report.competitorAnalysis.content, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH, lineGap: 3 });
        if (report.competitorAnalysis.directCompetitors?.length) {
          doc.moveDown(0.5);
          report.competitorAnalysis.directCompetitors.forEach((c) => {
            ensureSpace(35);
            doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_NAVY).text(`• ${c.name} (${c.pricePoint})`);
            doc.font('Helvetica').fontSize(8).fillColor(C_MUTED)
               .text(`  Strengths: ${c.strengths} | Weaknesses: ${c.weaknesses}`, { width: CONTENT_WIDTH - 15 });
          });
        }

        // 5. Target Audience
        sectionHeading(5, 'Target Audience & Customer Personas');
        doc.font('Helvetica').fontSize(9).fillColor(C_DARK)
           .text(report.targetAudience.content, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH, lineGap: 3 });
        if (report.targetAudience.personas?.length) {
          report.targetAudience.personas.forEach((p) => {
            ensureSpace(40);
            doc.moveDown(0.4);
            doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_TEAL).text(p.segment);
            doc.font('Helvetica').fontSize(8).fillColor(C_MUTED)
               .text(`Demographics: ${p.demographics}\nPain Points: ${p.painPoints}\nWillingness to Pay: ${p.willingnessToPay}`, { width: CONTENT_WIDTH });
          });
        }

        // 6. Marketing and Customer Acquisition Strategy
        sectionHeading(6, 'Marketing and Customer Acquisition Strategy');
        doc.font('Helvetica').fontSize(9).fillColor(C_DARK)
           .text(report.marketingAndCustomerAcquisition.content, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH, lineGap: 3 });
        if (report.marketingAndCustomerAcquisition.channels?.length) {
          doc.moveDown(0.4);
          report.marketingAndCustomerAcquisition.channels.forEach((ch) => {
            ensureSpace(30);
            doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_NAVY).text(`[${ch.priority}] ${ch.channel} — Est. CAC: ${ch.estimatedCac}`);
            doc.font('Helvetica').fontSize(8).fillColor(C_MUTED).text(`Tactics: ${ch.tactics}`, { width: CONTENT_WIDTH - 10 });
          });
        }

        // 7. Startup Cost Estimates
        sectionHeading(7, 'Startup Cost Estimates');
        const currSym = report.startupCostEstimates.currency === 'INR' ? '₹' : '$';
        doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C_BLUE)
           .text(`Total Estimated Capital Requirement: ${currSym}${report.startupCostEstimates.totalEstimatedStartupCost.toLocaleString('en-IN')}`);
        doc.font('Helvetica-Oblique').fontSize(8.5).fillColor(C_AMBER)
           .text(report.startupCostEstimates.budgetVariance);
        doc.moveDown(0.4);

        if (report.startupCostEstimates.lineItems?.length) {
          report.startupCostEstimates.lineItems.forEach((li) => {
            ensureSpace(22);
            doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_DARK)
               .text(`• ${li.category}: ${currSym}${li.amount.toLocaleString('en-IN')}`, { continued: true });
            doc.font('Helvetica').fontSize(8).fillColor(C_MUTED).text(` — ${li.description}`);
          });
        }

        // 8. Revenue & Expense Projections
        sectionHeading(8, 'Revenue and Operating Expense Projections');
        doc.font('Helvetica').fontSize(9).fillColor(C_DARK)
           .text(report.revenueAndExpenseProjections.content, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH, lineGap: 3 });
        doc.moveDown(0.3);
        doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_NAVY)
           .text(`Est. Monthly OpEx: ${currSym}${report.revenueAndExpenseProjections.monthlyOperatingExpenses.toLocaleString('en-IN')} | Projected Monthly Revenue: ${currSym}${report.revenueAndExpenseProjections.monthlyRevenueScenarioMin.toLocaleString('en-IN')} to ${currSym}${report.revenueAndExpenseProjections.monthlyRevenueScenarioMax.toLocaleString('en-IN')}`);
        doc.font('Helvetica-Oblique').fontSize(7.5).fillColor(C_MUTED)
           .text(report.revenueAndExpenseProjections.disclaimer, { width: CONTENT_WIDTH });

        // 9. Break-Even Analysis
        sectionHeading(9, 'Break-Even Analysis');
        doc.font('Helvetica').fontSize(9).fillColor(C_DARK)
           .text(report.breakEvenAnalysis.content, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH, lineGap: 3 });
        doc.moveDown(0.3);
        doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_TEAL)
           .text(`Target Break-Even Horizon: ${report.breakEvenAnalysis.estimatedMonthsToBreakEven} | Required Monthly Orders: ${report.breakEvenAnalysis.monthlyOrdersNeeded}`);

        // 10. Risks and Mitigation Strategies
        sectionHeading(10, 'Risks and Mitigation Strategies');
        if (report.risksAndMitigationStrategies.risks?.length) {
          report.risksAndMitigationStrategies.risks.forEach((r) => {
            ensureSpace(30);
            doc.font('Helvetica-Bold').fontSize(8.5).fillColor(r.severity === 'High' ? '#DC2626' : C_NAVY)
               .text(`[${r.severity} Risk] ${r.risk}`);
            doc.font('Helvetica').fontSize(8).fillColor(C_MUTED)
               .text(`Mitigation: ${r.mitigation}`, { width: CONTENT_WIDTH });
          });
        }

        // 11. Recommended Action Plan
        sectionHeading(11, 'Recommended Action Plan');
        if (report.recommendedActionPlan.phases?.length) {
          report.recommendedActionPlan.phases.forEach((p) => {
            ensureSpace(32);
            doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_BLUE).text(`${p.phase} (${p.timeline})`);
            doc.font('Helvetica').fontSize(8).fillColor(C_DARK)
               .text(`Milestones: ${p.keyMilestones?.join('; ')} | Deliverable: ${p.deliverable}`, { width: CONTENT_WIDTH });
          });
        }

        // 12. Data Sources, Assumptions, and Limitations
        sectionHeading(12, 'Data Sources, Assumptions, and Reliability Limitations');
        doc.font('Helvetica').fontSize(8.5).fillColor(C_DARK)
           .text(report.dataSourcesAssumptionsAndLimitations.content, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH, lineGap: 3 });
        doc.moveDown(0.3);
        doc.font('Helvetica-Bold').fontSize(8).fillColor(C_AMBER).text('Explicit Assumptions & Items Needing Field Validation:');
        report.dataSourcesAssumptionsAndLimitations.itemsNeedingValidation.forEach((item) => {
          ensureSpace(16);
          doc.font('Helvetica').fontSize(8).fillColor(C_MUTED).text(`! ${item}`);
        });
        doc.moveDown(0.4);
        doc.font('Helvetica-Oblique').fontSize(8).fillColor('#B91C1C')
           .text(report.dataSourcesAssumptionsAndLimitations.limitationsNote, { width: CONTENT_WIDTH });

        // Add running headers & page footers across all buffered pages
        const range = doc.bufferedPageRange();
        const totalPages = range.count;
        for (let i = 0; i < totalPages; i++) {
          doc.switchToPage(i);
          if (i > 0) {
            doc.rect(MARGIN_LEFT, 24, CONTENT_WIDTH, 0.5).fill(C_BORDER);
            doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_BLUE)
               .text('AI MULTI-AGENT VIRTUAL CONSULTING SYSTEM', MARGIN_LEFT, 14);
            doc.font('Helvetica').fontSize(7.5).fillColor(C_MUTED)
               .text(report.businessName.toUpperCase(), MARGIN_LEFT, 14, { align: 'right', width: CONTENT_WIDTH });

            doc.rect(MARGIN_LEFT, PAGE_HEIGHT - 32, CONTENT_WIDTH, 0.5).fill(C_BORDER);
            doc.font('Helvetica').fontSize(7.5).fillColor(C_MUTED)
               .text('Confidential Strategic Business Plan — Generated via Customer Support Agent', MARGIN_LEFT, PAGE_HEIGHT - 22);
            doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_NAVY)
               .text(`Page ${i + 1} of ${totalPages}`, MARGIN_LEFT, PAGE_HEIGHT - 22, { align: 'right', width: CONTENT_WIDTH });
          }
        }

        doc.end();

        stream.on('finish', () => {
          const stats = fs.statSync(outputPath);
          this.status = 'Completed';
          resolve({
            success: true,
            filePath: outputPath,
            fileName,
            downloadUrl: `/api/consultations/${report.consultationId}/pdf`,
            fileSizeBytes: stats.size,
            generatedAt: new Date().toISOString()
          });
        });

        stream.on('error', (err) => {
          this.status = 'Failed';
          reject(err);
        });
      } catch (err: any) {
        this.status = 'Failed';
        reject(err);
      }
    });
  }
}
