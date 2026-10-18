const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

class CustomerSupportAgent {
  constructor() {
    this.name = 'AI Customer Support Consulting Agent';
    this.version = '1.0.0-prototype';
    this.project = 'AI Multi Consulting Agent (Final Year B.Tech CSE)';
  }

  // Analyze a business concept and generate structured support operations
  analyzeBusiness(input) {
    const businessName = input.businessName || 'Helping Hands Healthcare & Caregiver Services';
    const industry = input.industry || 'Home Healthcare & Eldercare Services';
    const description = input.description || 'On-demand home healthcare, certified eldercare companions, post-operative nursing, and physiotherapy at home.';
    const targetAudience = input.targetAudience || 'Senior citizens, chronic illness patients, working adult children, and NRIs.';

    return {
      metadata: {
        agent: this.name,
        project: this.project,
        version: this.version,
        timestamp: new Date().toISOString(),
        businessName,
        industry,
        targetAudience
      },
      executiveSummary: {
        philosophy: 'Empathy First, Speed Always, Escalation Guaranteed',
        coreSummary: `High-sensitivity operations require a hybrid support architecture. An AI Tier-1 agent handles 65%+ routine queries (FAQs, schedule changes, caregiver verification) 24/7 across WhatsApp and web, while a deterministic SLA engine escalates medical alerts and caregiver delays to human On-Duty Care Coordinators within 15 seconds.`,
        keyHighlights: [
          'WhatsApp Business API as primary family communication channel',
          '24/7 Priority Voice IVR for senior accessibility and medical emergencies',
          'Deterministic 4-level priority triage (P1 Critical to P4 General FAQ)',
          'Automated daily vitals summaries sent to family members post-shift'
        ]
      },
      customerPersonas: [
        {
          role: 'Working Adult Children & NRIs (Primary Payers)',
          needs: 'High anxiety regarding aging parents; demands real-time transparency, daily health logs, and zero caregiver delays.',
          preferredChannel: 'WhatsApp Business API & Mobile App Dashboard'
        },
        {
          role: 'Senior Citizens & Patients (Primary Beneficiaries)',
          needs: 'Needs patience, warmth, clear voice communication, and familiar caregiver continuity.',
          preferredChannel: '24/7 Voice Telephone Helpline (Zero-wait IVR)'
        },
        {
          role: 'Field Caregivers & Certified Nurses (Service Workforce)',
          needs: 'Field dispatch support, live GPS route assistance, patient emergency protocol guidance.',
          preferredChannel: 'In-App Caregiver Coordination Dispatch'
        }
      ],
      supportChannels: [
        {
          channel: 'WhatsApp Business Cloud API',
          purpose: 'Family care updates, daily vitals PDF reports, booking changes, 1-tap CSAT feedback.',
          sla: 'AI < 45s | Human < 3 mins',
          suitability: '95%+ adoption across families; frictionless multimedia sharing (vitals logs, photos).'
        },
        {
          channel: '24/7 Dedicated Voice Helpline (IVR)',
          purpose: 'Elderly direct dial, caregiver punctuality emergencies, acute distress calls.',
          sla: 'Pick up < 20s | 0 Dropped Calls',
          suitability: 'Critical for elderly users unable to type; delivers human voice reassurance.'
        },
        {
          channel: 'Web & In-App Conversational AI',
          purpose: 'Pre-purchase vetting, package comparison, caregiver credential lookups.',
          sla: 'Instant (< 3s)',
          suitability: 'Scales 24/7 during marketing spikes; deflector for 65%+ routine pre-sales FAQs.'
        },
        {
          channel: 'Email Support',
          purpose: 'Doctor logs, corporate inquiries, GST invoices, insurance claim substantiations.',
          sla: '< 2h Response | < 12h Resolution',
          suitability: 'Immutable digital audit trail for disputes, insurance coverage, and compliance.'
        },
        {
          channel: 'In-App SOS & Live Shift Chat',
          purpose: 'Active shift coordination, patient vitals alerts, caregiver check-in.',
          sla: '< 30s Priority Routing',
          suitability: 'Direct telemetry link between active caregiver GPS and family.'
        }
      ],
      workflowSteps: [
        { step: '1. Ingestion', action: 'Inbound message received via WhatsApp, Voice, Web, or App.' },
        { step: '2. Classification', action: 'NLU Intent Classifier categorizes query into P1 (Emergency), P2 (Delay), P3 (Billing), P4 (FAQ).' },
        { step: '3. Response / Solution', action: 'P4 handled instantly by RAG AI. P3 verified via automated ledger check.' },
        { step: '4. Human Escalation', action: 'P1 and P2 bypass bots and alert On-Duty Care Coordinator within 15 seconds.' },
        { step: '5. Resolution', action: 'Standby caregiver dispatched or billing reconciled; family confirmed.' },
        { step: '6. Feedback', action: 'Automated 1-click WhatsApp CSAT rating recorded in audit repository.' }
      ],
      faqs: [
        {
          q: 'How does Helping Hands verify caregiver background and credentials?',
          a: 'All caregivers undergo a mandatory 4-step check: government ID, local police background verification, nursing/geriatric certification audit, and hands-on clinical evaluation by our Nursing Superintendent.'
        },
        {
          q: 'What happens if a caregiver is late or absent for a scheduled shift?',
          a: 'We maintain a 15% standby caregiver roster per zone. If an attendant is delayed >15 minutes, automated dispatch alerts our coordinator and sends a standby caregiver within 45 minutes.'
        },
        {
          q: 'How are service pricing packages structured?',
          a: 'Services are tiered into Companion Care, Skilled Nursing, and Intensive Post-Op/Dementia Care, offered in 8-hour, 12-hour, and 24-hour live-in blocks with zero hidden fees.'
        },
        {
          q: 'Does Helping Hands provide emergency ambulance or ICU services?',
          a: 'No. Helping Hands provides non-critical home health and daily living support. For life-threatening emergencies, our protocol immediately dials emergency medical services (108).'
        },
        {
          q: 'Can family members living abroad receive daily health logs?',
          a: 'Yes. At the end of every shift, caregivers log vitals (BP, sugar, pulse), meals, and meds in the app, and an automated PDF summary is sent directly to your WhatsApp.'
        },
        {
          q: 'What payment methods are supported and when is billing done?',
          a: 'We accept UPI, cards, net banking, and auto-debit mandates. Services are billed in advance for weekly or monthly packages with GST-compliant tax receipts.'
        },
        {
          q: 'What is the shift rescheduling and cancellation policy?',
          a: 'Cancellations or schedule changes with at least 12 hours advance notice receive 100% wallet credit at zero penalty. Within 4 hours, a 30% caregiver allowance applies.'
        },
        {
          q: 'How do refunds work if a patient is admitted to a hospital?',
          a: 'Care shifts are frozen immediately. Unused prepaid balances can remain in your health wallet with lifetime validity or be refunded to your bank account within 5–7 business days.'
        },
        {
          q: 'Can we request a caregiver replacement if compatibility is poor?',
          a: 'Yes. Rapport is essential in eldercare. You may request a caregiver replacement after the first shift at zero fee, and our coordinator will assign an alternate profile.'
        },
        {
          q: 'Can we request specific gender preferences (male/female caregiver)?',
          a: 'Yes. You may specify male or female caregivers during booking for all hygiene, bathing, and mobility assistance.'
        }
      ],
      complaintPlan: [
        {
          id: 'CMP-1',
          issue: 'Caregiver Delay >30 mins / No-Show',
          priority: 'P2 (High)',
          escalate: 'YES (Within 3 mins to Zone Lead)',
          script: 'I sincerely apologize for this distressing delay. I am tracking the caregiver GPS location now and dispatching our standby coordinator.',
          resolution: 'Deploy Standby Caregiver within 45 mins. Provide 50% credit on the shift as service guarantee.'
        },
        {
          id: 'CMP-2',
          issue: 'Rough Bedside Manner / Inadequate Skill',
          priority: 'P1 (Critical Safety)',
          escalate: 'YES (Direct to Head of Clinical Nursing)',
          script: 'We take patient dignity and comfort with absolute seriousness. I am logging your feedback for our Nursing Director immediately.',
          resolution: 'Nursing Lead calls family within 10 mins. Attendant removed from case, sent for retraining, and replaced.'
        },
        {
          id: 'CMP-3',
          issue: 'Billing Dispute / Extra Charge on Invoice',
          priority: 'P3 (Medium)',
          escalate: 'YES (If dispute > ₹500)',
          script: 'Thank you for pointing this out. Let me compare your GPS shift timesheet with the invoice ledger right now.',
          resolution: 'Reconcile digital check-in times; correct invoice and issue credit note within 2 hours.'
        },
        {
          id: 'CMP-4',
          issue: 'Unanswered Emergency Support Call',
          priority: 'P1 (Process Failure)',
          escalate: 'YES (Mandatory Director Call)',
          script: 'I understand how alarming an unanswered emergency line is. Our Operations Director is bridging to your phone right now.',
          resolution: 'Direct phone bridge to family. Telephony line audit initiated; incident report shared within 24 hours.'
        },
        {
          id: 'CMP-5',
          issue: 'App Duplicate Booking Payment Glitch',
          priority: 'P4 (Technical)',
          escalate: 'NO (Automated Gateway API Check)',
          script: 'I can see the duplicate payment reference. Your funds are completely safe; refund is initiated right now.',
          resolution: 'Automated payment gateway refund via Razorpay/Stripe API; SMS/WhatsApp confirmation in 5 minutes.'
        }
      ],
      kpis: [
        { metric: 'Customer Satisfaction Score (CSAT)', target: '> 92% Positive', trigger: 'Review if < 88%' },
        { metric: 'First Response Time (FRT) - Chat', target: '< 45 seconds', trigger: 'Alert if queue > 90s' },
        { metric: 'First Response Time (FRT) - Phone', target: '< 20 seconds', trigger: 'Zero dropped call tolerance' },
        { metric: 'Average Resolution Time (ART) - Dispatch', target: '< 15 minutes', trigger: 'Audit if > 25 mins' },
        { metric: 'First Contact Resolution (FCR)', target: '72% – 78%', trigger: 'Training if < 65%' },
        { metric: 'Net Promoter Score (NPS)', target: '> +65', trigger: 'Founder call to detractors' }
      ],
      roadmap: [
        { phase: 'Phase 1: Foundation (Weeks 1-2)', milestones: 'Google Workspace, WhatsApp Business App, core SOP documentation.' },
        { phase: 'Phase 2: Launch Operations (Weeks 3-4)', milestones: 'Exotel/Twilio IVR, Freshdesk helpdesk, 3 Care Coordinators trained.' },
        { phase: 'Phase 3: AI & Automation (Weeks 5-8)', milestones: 'RAG AI Chatbot, automated WhatsApp daily care PDF logs, 1-tap CSAT.' },
        { phase: 'Phase 4: Scaling & Predictive (Weeks 9-12)', milestones: 'Caregiver GPS geofencing, automated standby dispatch, AI Manager API sync.' }
      ],
      topRecommendations: [
        'Launch official WhatsApp Business API as the core communication channel.',
        'Enforce a 15% standby caregiver roster in every zone to prevent delay risks.',
        'Program deterministic medical boundaries: AI must never attempt medical diagnoses.',
        'Send structured daily care PDF summaries to family members post-shift.',
        'Conduct 40 hours of empathetic communication and de-escalation training for all coordinators.'
      ]
    };
  }

  // Live query simulator: classifies intent and produces agent response
  simulateCustomerQuery(userMessage) {
    const text = (userMessage || '').toLowerCase();
    
    // Check for Medical Distress / SOS (P1)
    if (text.includes('emergency') || text.includes('unconscious') || text.includes('breathing') || text.includes('chest pain') || text.includes('fell') || text.includes('blood') || text.includes('doctor')) {
      return {
        priority: 'P1 - Critical Safety / Medical Alert',
        category: 'Medical Emergency',
        humanEscalationRequired: true,
        escalationTarget: 'On-Duty Medical Officer & Emergency Services (108)',
        sla: 'Instant (< 15 seconds)',
        agentResponse: `EMERGENCY ALERT TRIGGERED: If the patient is facing an acute medical crisis, please call emergency ambulance services (108) immediately.

I have placed our On-Duty Clinical Supervisor on priority voice bridge to call your registered number right this second. Please do not move the patient if a fall has occurred. A coordinator is dialing you now.`
      };
    }

    // Check for Delay / No-show (P2)
    if (text.includes('late') || text.includes('not reached') || text.includes('absent') || text.includes('waiting') || text.includes('where is') || text.includes('not arrived') || text.includes('delay')) {
      return {
        priority: 'P2 - High Operational Urgency',
        category: 'Caregiver Punctuality & Dispatch',
        humanEscalationRequired: true,
        escalationTarget: 'Zone Care Coordinator & Standby Dispatch',
        sla: '< 3 minutes update',
        agentResponse: `I sincerely apologize for this distressing delay. We know how critical timely care is for your family.

Here is what I have initiated right now:
1. I am checking the caregiver's live GPS coordinates and alerting our Zone Duty Coordinator, Vikram.
2. Our local standby verified attendant has been placed on pre-alert.

Our coordinator will call you within 3 minutes with the arrival ETA or dispatch confirmation for a standby attendant. You will not be charged for this morning's delayed shift.`
      };
    }

    // Check for Refund / Cancellation (P3)
    if (text.includes('refund') || text.includes('cancel') || text.includes('hospital') || text.includes('money back') || text.includes('admit')) {
      return {
        priority: 'P3 - Financial & Billing',
        category: 'Cancellation & Prorated Refund',
        humanEscalationRequired: false,
        escalationTarget: 'Automated Billing Service (escalates to Billing Lead if dispute)',
        sla: '< 2 hours processing',
        agentResponse: `Hello. We understand care needs can change suddenly due to medical circumstances.

Your care schedule has been paused immediately as of today so no shifts are deducted. Regarding your unused package days:
1. Medical Wallet Hold: Keep the unused days in your Helping Hands Health Wallet with lifetime validity, ready when care resumes.
2. Prorated Bank Refund: We can process the remaining unused balance back to your original payment method (takes 5–7 business days).

Would you prefer the Medical Wallet Hold or the Bank Refund?`
      };
    }

    // Check for Pre-Purchase / Caregiver Qualifications (P4)
    if (text.includes('qualification') || text.includes('vetting') || text.includes('police') || text.includes('price') || text.includes('cost') || text.includes('dementia') || text.includes('nurse') || text.includes('book')) {
      return {
        priority: 'P4 - General Inquiry / Service Discovery',
        category: 'Service Discovery & Caregiver Vetting',
        humanEscalationRequired: false,
        escalationTarget: 'Self-Service AI (escalates on request)',
        sla: 'Instantaneous (< 3s)',
        agentResponse: `Thank you for inquiring with Helping Hands! We provide certified, background-verified caregivers for Assisted Eldercare, Skilled Nursing, and Dementia Support (8h, 12h, and 24h live-in shifts).

Our trust protocols:
1. 100% government ID & local police criminal background verification.
2. Clinical skill certification verified by our Senior Nursing Superintendent.
3. Complimentary 30-minute introductory video orientation prior to first booking.

Would you like me to share our service guide and check caregiver availability in your area?`
      };
    }

    // Default conversational response
    return {
      priority: 'P4 - General Customer Assistance',
      category: 'General Support Ingestion',
      humanEscalationRequired: false,
      escalationTarget: 'Tier-1 AI Assistant',
      sla: 'Instantaneous (< 3s)',
      agentResponse: `Thank you for reaching out to Helping Hands Customer Support. I am your AI Support Consultant.

I can assist you with:
• Checking caregiver credentials and police verification
• Scheduling or rescheduling nursing shifts
• Pausing care packages or requesting prorated refunds
• Immediate escalation for caregiver delays or care questions

How can I support you and your family today?`
    };
  }

  // Generate the consulting PDF report
  generatePDFReport(input, targetPath) {
    const analysis = this.analyzeBusiness(input);
    const outputPath = targetPath || path.join(__dirname, 'Customer_Support_Consulting_Report.pdf');

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 45, bottom: 45, left: 45, right: 45 },
      bufferPages: true
    });

    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const C_NAVY = '#1E3A8A';
    const C_TEAL = '#0D9488';
    const C_DARK = '#1F2937';
    const C_MUTED = '#4B5563';
    const C_LIGHT = '#F8FAFC';
    const C_BORDER = '#CBD5E1';
    const C_WHITE = '#FFFFFF';

    const PAGE_WIDTH = 595.28;
    const PAGE_HEIGHT = 841.89;
    const MARGIN_LEFT = 45;
    const MARGIN_RIGHT = 45;
    const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

    function ensureSpace(needed) {
      if (doc.y + needed > PAGE_HEIGHT - 50) {
        doc.addPage();
      }
    }

    // Cover page
    doc.page.margins.top = 0;
    doc.page.margins.bottom = 0;
    doc.rect(0, 0, PAGE_WIDTH, 12).fill(C_NAVY);
    doc.rect(0, 12, PAGE_WIDTH, 4).fill(C_TEAL);
    doc.rect(MARGIN_LEFT, 75, 6, 85).fill(C_TEAL);

    doc.font('Helvetica-Bold').fontSize(22).fillColor(C_NAVY)
       .text('AI MULTI CONSULTING AGENT SYSTEM', MARGIN_LEFT + 18, 80, { lineBreak: false });
    doc.font('Helvetica-Bold').fontSize(13).fillColor(C_TEAL)
       .text('CUSTOMER SUPPORT CONSULTING AGENT — SPECIALIZED REPORT', MARGIN_LEFT + 18, 110, { lineBreak: false });
    doc.font('Helvetica').fontSize(9.5).fillColor(C_MUTED)
       .text('Final Year B.Tech CSE Project | Autonomous Agent Prototype Execution', MARGIN_LEFT + 18, 132, { lineBreak: false });

    doc.rect(MARGIN_LEFT, 195, CONTENT_WIDTH, 130).fill(C_LIGHT);
    doc.rect(MARGIN_LEFT, 195, CONTENT_WIDTH, 130).stroke(C_BORDER);
    doc.rect(MARGIN_LEFT, 195, 6, 130).fill(C_NAVY);

    doc.font('Helvetica-Bold').fontSize(18).fillColor(C_NAVY)
       .text('CUSTOMER SUPPORT STRATEGY &', MARGIN_LEFT + 25, 215, { lineBreak: false });
    doc.font('Helvetica-Bold').fontSize(18).fillColor(C_NAVY)
       .text('OPERATIONS BLUEPRINT', MARGIN_LEFT + 25, 238, { lineBreak: false });

    doc.font('Helvetica-Bold').fontSize(12).fillColor(C_TEAL)
       .text(`Target Venture: ${analysis.metadata.businessName}`, MARGIN_LEFT + 25, 268, { lineBreak: false });
    doc.font('Helvetica-Oblique').fontSize(9.5).fillColor(C_MUTED)
       .text('Autonomous Customer Support Analysis, Multi-Channel Workflows, FAQ & SLA Matrix', MARGIN_LEFT + 25, 292, { lineBreak: false });

    const metaY = 355;
    doc.rect(MARGIN_LEFT, metaY, CONTENT_WIDTH, 175).stroke(C_BORDER);
    doc.rect(MARGIN_LEFT, metaY, CONTENT_WIDTH, 26).fill(C_NAVY);
    doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C_WHITE)
       .text('REPORT SPECIFICATION & METADATA', MARGIN_LEFT + 14, metaY + 8, { lineBreak: false });

    const metaItems = [
      ['Proposed Venture:', analysis.metadata.businessName],
      ['Core Business Domain:', analysis.metadata.industry],
      ['Author / Agent Identity:', analysis.metadata.agent],
      ['Coordinating Platform:', analysis.metadata.project],
      ['Date of Consultation:', 'October 12, 2026'],
      ['Target Demographics:', analysis.metadata.targetAudience],
      ['Document Classification:', 'Confidential Strategic Feasibility & Operational Blueprint']
    ];

    let rowY = metaY + 34;
    metaItems.forEach(([k, v], idx) => {
      if (idx % 2 === 1) doc.rect(MARGIN_LEFT + 1, rowY - 2, CONTENT_WIDTH - 2, 18).fill('#F1F5F9');
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_DARK).text(k, MARGIN_LEFT + 14, rowY, { lineBreak: false });
      doc.font('Helvetica').fontSize(8.5).fillColor(C_MUTED).text(v, MARGIN_LEFT + 175, rowY, { width: CONTENT_WIDTH - 190, lineBreak: false });
      rowY += 19;
    });

    const noticeY = 560;
    doc.rect(MARGIN_LEFT, noticeY, CONTENT_WIDTH, 135).fill('#EFF6FF');
    doc.rect(MARGIN_LEFT, noticeY, CONTENT_WIDTH, 135).stroke('#BFDBFE');
    doc.rect(MARGIN_LEFT, noticeY, 4, 135).fill('#3B82F6');
    doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#1E40AF')
       .text('PROJECT ARCHITECTURE NOTICE & SYSTEM BOUNDARIES', MARGIN_LEFT + 14, noticeY + 12, { lineBreak: false });
    doc.font('Helvetica').fontSize(8.5).fillColor('#1E3A8A').text(
      'This document represents the independent strategic deliverable generated exclusively by the Customer Support Consulting Agent. Detailed market feasibility, competitor benchmarking, ad spend forecasting, and financial balance sheets are reserved for the upcoming Research, Marketing, and Finance agents under AI Manager orchestration.\n\nAll workflows, FAQs, escalation pathways, and SLA metrics herein are structured for direct plug-in integration into the multi-agent decision framework.',
      MARGIN_LEFT + 14, noticeY + 30, { width: CONTENT_WIDTH - 28, lineGap: 3 }
    );

    doc.rect(0, PAGE_HEIGHT - 18, PAGE_WIDTH, 18).fill(C_NAVY);
    doc.font('Helvetica').fontSize(7.5).fillColor(C_WHITE)
       .text(`AI Multi Consulting Agent | Department of Computer Science & Engineering | ${analysis.metadata.businessName} Report`, MARGIN_LEFT, PAGE_HEIGHT - 13, { lineBreak: false });

    doc.page.margins.top = 45;
    doc.page.margins.bottom = 45;
    doc.addPage();

    // Body rendering helper
    function addSecH(num, t) {
      ensureSpace(55);
      doc.moveDown(0.7);
      const cy = doc.y;
      doc.rect(MARGIN_LEFT, cy, CONTENT_WIDTH, 22).fill(C_NAVY);
      doc.rect(MARGIN_LEFT, cy, 5, 22).fill(C_TEAL);
      doc.font('Helvetica-Bold').fontSize(10.5).fillColor(C_WHITE).text(`${num}. ${t.toUpperCase()}`, MARGIN_LEFT + 14, cy + 6, { lineBreak: false });
      doc.y = cy + 28;
    }

    function addP(txt) {
      ensureSpace(25);
      doc.font('Helvetica').fontSize(8.5).fillColor(C_DARK).text(txt, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH, lineGap: 2.5 });
      doc.moveDown(0.35);
    }

    // 1. Report Title & Business Details
    addSecH(1, 'Report Title and Business Details');
    addP(`Strategic Customer Support Operations Blueprint formulated for "${analysis.metadata.businessName}" (${analysis.metadata.industry}) under the ${analysis.metadata.project}.`);
    
    // 2. Executive Summary
    addSecH(2, 'Executive Summary');
    addP(analysis.executiveSummary.coreSummary);

    // 3. Recommended Support Channels
    addSecH(3, 'Recommended Support Channels & SLAs');
    analysis.supportChannels.forEach(c => {
      ensureSpace(25);
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_NAVY).text(`• ${c.channel}: `, MARGIN_LEFT, doc.y, { continued: true });
      doc.font('Helvetica').fontSize(8.5).fillColor(C_DARK).text(`${c.purpose} (SLA: ${c.sla})`);
      doc.moveDown(0.2);
    });

    // 4. Support Workflow
    addSecH(4, 'Support Workflow & Deterministic Escalation');
    analysis.workflowSteps.forEach(w => {
      ensureSpace(20);
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_TEAL).text(w.step, MARGIN_LEFT, doc.y, { continued: true });
      doc.font('Helvetica').fontSize(8.5).fillColor(C_DARK).text(` — ${w.action}`);
      doc.moveDown(0.2);
    });

    // 5. FAQs
    addSecH(5, 'Frequently Asked Questions (FAQs)');
    analysis.faqs.forEach((f, i) => {
      ensureSpace(32);
      doc.font('Helvetica-Bold').fontSize(8).fillColor(C_NAVY).text(`Q${i+1}: ${f.q}`, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH });
      doc.font('Helvetica').fontSize(8).fillColor(C_DARK).text(f.a, MARGIN_LEFT, doc.y + 2, { width: CONTENT_WIDTH, lineGap: 2 });
      doc.moveDown(0.3);
    });

    // 6. Complaint Management Plan
    addSecH(6, 'Complaint Management Plan');
    analysis.complaintPlan.forEach(c => {
      ensureSpace(40);
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#B91C1C').text(`[${c.priority}] ${c.issue}`, MARGIN_LEFT, doc.y);
      doc.font('Helvetica-Oblique').fontSize(8).fillColor(C_DARK).text(`Script: "${c.script}"`, MARGIN_LEFT, doc.y + 2, { width: CONTENT_WIDTH });
      doc.font('Helvetica').fontSize(8).fillColor(C_MUTED).text(`Action: ${c.resolution} | Escalation: ${c.escalate}`, MARGIN_LEFT, doc.y + 2, { width: CONTENT_WIDTH });
      doc.moveDown(0.4);
    });

    // 7. KPIs & Retention
    addSecH(7, 'Performance Scorecard & KPIs');
    analysis.kpis.forEach(k => {
      ensureSpace(18);
      doc.font('Helvetica-Bold').fontSize(8).fillColor(C_NAVY).text(`• ${k.metric}: `, MARGIN_LEFT, doc.y, { continued: true });
      doc.font('Helvetica').fontSize(8).fillColor(C_DARK).text(`Target: ${k.target} (Alert: ${k.trigger})`);
      doc.moveDown(0.2);
    });

    // 8. Roadmap & Actions
    addSecH(8, 'Implementation Roadmap & Priority Actions');
    analysis.roadmap.forEach(r => {
      ensureSpace(20);
      doc.font('Helvetica-Bold').fontSize(8).fillColor(C_TEAL).text(r.phase, MARGIN_LEFT, doc.y, { continued: true });
      doc.font('Helvetica').fontSize(8).fillColor(C_MUTED).text(`: ${r.milestones}`);
      doc.moveDown(0.2);
    });

    // Buffer pages header/footer
    const range = doc.bufferedPageRange();
    const totalPages = range.count;
    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);
      doc.page.margins.top = 0;
      doc.page.margins.bottom = 0;
      if (i > 0) {
        doc.rect(MARGIN_LEFT, 25, CONTENT_WIDTH, 0.5).fill(C_BORDER);
        doc.font('Helvetica-Bold').fontSize(7).fillColor(C_NAVY)
           .text('AI MULTI CONSULTING AGENT | CUSTOMER SUPPORT DIVISION', MARGIN_LEFT, 15, { lineBreak: false });
        doc.font('Helvetica').fontSize(7).fillColor(C_MUTED)
           .text(`${analysis.metadata.businessName.toUpperCase()} CONSULTING REPORT`, MARGIN_LEFT, 15, { align: 'right', width: CONTENT_WIDTH, lineBreak: false });

        doc.rect(MARGIN_LEFT, PAGE_HEIGHT - 32, CONTENT_WIDTH, 0.5).fill(C_BORDER);
        doc.font('Helvetica').fontSize(7).fillColor(C_MUTED)
           .text('Confidential — For Internal & Final Year Project Review Only', MARGIN_LEFT, PAGE_HEIGHT - 24, { lineBreak: false });
        doc.font('Helvetica-Bold').fontSize(7).fillColor(C_NAVY)
           .text(`Page ${i + 1} of ${totalPages}`, MARGIN_LEFT, PAGE_HEIGHT - 24, { align: 'right', width: CONTENT_WIDTH, lineBreak: false });
      }
    }

    doc.end();
    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    });
  }
}

module.exports = CustomerSupportAgent;
