const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function generatePDF() {
  const outputPath = path.join(__dirname, 'Customer_Support_Consulting_Report.pdf');
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 45, bottom: 45, left: 45, right: 45 },
    bufferPages: true
  });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Palette definition
  const C_NAVY = '#1E3A8A';
  const C_TEAL = '#0D9488';
  const C_DARK = '#1F2937';
  const C_MUTED = '#4B5563';
  const C_LIGHT = '#F8FAFC';
  const C_BORDER = '#CBD5E1';
  const C_WHITE = '#FFFFFF';
  const C_AMBER = '#B45309';

  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;
  const MARGIN_LEFT = 45;
  const MARGIN_RIGHT = 45;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT; // 505.28

  // Helper: check page break
  function ensureSpace(needed) {
    if (doc.y + needed > PAGE_HEIGHT - 50) {
      doc.addPage();
    }
  }

  // --- COVER PAGE ---
  function drawCoverPage() {
    doc.page.margins.top = 0;
    doc.page.margins.bottom = 0;

    // Decorative top accent banners
    doc.rect(0, 0, PAGE_WIDTH, 12).fill(C_NAVY);
    doc.rect(0, 12, PAGE_WIDTH, 4).fill(C_TEAL);

    // Decorative vertical bar
    doc.rect(MARGIN_LEFT, 75, 6, 85).fill(C_TEAL);

    doc.font('Helvetica-Bold').fontSize(22).fillColor(C_NAVY)
       .text('AI MULTI CONSULTING AGENT SYSTEM', MARGIN_LEFT + 18, 80, { width: CONTENT_WIDTH - 20, lineBreak: false });
    
    doc.font('Helvetica-Bold').fontSize(13).fillColor(C_TEAL)
       .text('CUSTOMER SUPPORT CONSULTING AGENT — SPECIALIZED REPORT', MARGIN_LEFT + 18, 110, { width: CONTENT_WIDTH - 20, lineBreak: false });
    
    doc.font('Helvetica').fontSize(9.5).fillColor(C_MUTED)
       .text('Final Year B.Tech CSE Project | Autonomous Agent Prototype Execution', MARGIN_LEFT + 18, 132, { width: CONTENT_WIDTH - 20, lineBreak: false });

    // Main Title Card
    doc.rect(MARGIN_LEFT, 195, CONTENT_WIDTH, 130).fill(C_LIGHT);
    doc.rect(MARGIN_LEFT, 195, CONTENT_WIDTH, 130).stroke(C_BORDER);
    doc.rect(MARGIN_LEFT, 195, 6, 130).fill(C_NAVY);

    doc.font('Helvetica-Bold').fontSize(18).fillColor(C_NAVY)
       .text('CUSTOMER SUPPORT STRATEGY &', MARGIN_LEFT + 25, 215, { lineBreak: false });
    doc.font('Helvetica-Bold').fontSize(18).fillColor(C_NAVY)
       .text('OPERATIONS BLUEPRINT', MARGIN_LEFT + 25, 238, { lineBreak: false });

    doc.font('Helvetica-Bold').fontSize(12).fillColor(C_TEAL)
       .text('Target Venture: Helping Hands Healthcare & Caregiver Services', MARGIN_LEFT + 25, 268, { lineBreak: false });

    doc.font('Helvetica-Oblique').fontSize(9.5).fillColor(C_MUTED)
       .text('Autonomous Customer Support Analysis, Multi-Channel Workflows, FAQ & SLA Matrix', MARGIN_LEFT + 25, 292, { lineBreak: false });

    // Metadata Table Card
    const metaY = 355;
    doc.rect(MARGIN_LEFT, metaY, CONTENT_WIDTH, 175).stroke(C_BORDER);
    doc.rect(MARGIN_LEFT, metaY, CONTENT_WIDTH, 26).fill(C_NAVY);
    doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C_WHITE)
       .text('REPORT SPECIFICATION & METADATA', MARGIN_LEFT + 14, metaY + 8, { lineBreak: false });

    const metaItems = [
      ['Proposed Venture:', 'Helping Hands Healthcare & Caregiver Services Pvt. Ltd.'],
      ['Core Business Domain:', 'On-Demand Home Eldercare, Nursing & Daily Assisted Living'],
      ['Author / Agent Identity:', 'AI Customer Support Consulting Agent (Independent Subsystem)'],
      ['Coordinating Platform:', 'AI Multi Consulting Agent Platform (Manager + 4 Specialist Agents)'],
      ['Date of Consultation:', 'October 12, 2026'],
      ['Target Demographics:', 'Senior Citizens, Chronic Patients, Working Family Caregivers & NRIs'],
      ['Document Classification:', 'Confidential Strategic Feasibility & Operational Blueprint']
    ];

    let rowY = metaY + 34;
    metaItems.forEach(([k, v], idx) => {
      if (idx % 2 === 1) {
        doc.rect(MARGIN_LEFT + 1, rowY - 2, CONTENT_WIDTH - 2, 18).fill('#F1F5F9');
      }
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_DARK).text(k, MARGIN_LEFT + 14, rowY, { lineBreak: false });
      doc.font('Helvetica').fontSize(8.5).fillColor(C_MUTED).text(v, MARGIN_LEFT + 175, rowY, { width: CONTENT_WIDTH - 190, lineBreak: false });
      rowY += 19;
    });

    // Executive Notice Box
    const noticeY = 560;
    doc.rect(MARGIN_LEFT, noticeY, CONTENT_WIDTH, 135).fill('#EFF6FF');
    doc.rect(MARGIN_LEFT, noticeY, CONTENT_WIDTH, 135).stroke('#BFDBFE');
    doc.rect(MARGIN_LEFT, noticeY, 4, 135).fill('#3B82F6');

    doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#1E40AF')
       .text('PROJECT ARCHITECTURE NOTICE & SYSTEM BOUNDARIES', MARGIN_LEFT + 14, noticeY + 12, { lineBreak: false });

    doc.font('Helvetica').fontSize(8.5).fillColor('#1E3A8A').text(
      'This document represents the independent strategic deliverable generated exclusively by the Customer Support Consulting Agent. In accordance with project architectural guidelines, detailed market feasibility, competitor benchmarking, ad spend forecasting, and financial balance sheets are reserved for the upcoming Research, Marketing, and Finance agents under AI Manager orchestration.\n\nAll customer operational workflows, FAQs, complaint escalation pathways, tool stacks, and SLA metrics herein are structured for direct plug-in integration into the multi-agent decision framework.',
      MARGIN_LEFT + 14, noticeY + 30, { width: CONTENT_WIDTH - 28, lineGap: 3 }
    );

    // Decorative Bottom Bar
    doc.rect(0, PAGE_HEIGHT - 18, PAGE_WIDTH, 18).fill(C_NAVY);
    doc.font('Helvetica').fontSize(7.5).fillColor(C_WHITE)
       .text('AI Multi Consulting Agent | Department of Computer Science & Engineering | Helping Hands Report', MARGIN_LEFT, PAGE_HEIGHT - 13, { lineBreak: false });

    doc.page.margins.top = 45;
    doc.page.margins.bottom = 45;
  }

  // --- SECTION HEADERS ---
  function addSectionHeader(num, title) {
    ensureSpace(55);
    doc.moveDown(0.7);
    const curY = doc.y;
    doc.rect(MARGIN_LEFT, curY, CONTENT_WIDTH, 22).fill(C_NAVY);
    doc.rect(MARGIN_LEFT, curY, 5, 22).fill(C_TEAL);
    doc.font('Helvetica-Bold').fontSize(10.5).fillColor(C_WHITE)
       .text(`${num}. ${title.toUpperCase()}`, MARGIN_LEFT + 14, curY + 6, { lineBreak: false });
    doc.y = curY + 28;
  }

  function addSubSection(title) {
    ensureSpace(35);
    doc.moveDown(0.4);
    const curY = doc.y;
    doc.rect(MARGIN_LEFT, curY, 3, 13).fill(C_TEAL);
    doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C_NAVY)
       .text(title, MARGIN_LEFT + 10, curY + 2, { lineBreak: false });
    doc.y = curY + 16;
  }

  function addParagraph(text, options = {}) {
    ensureSpace(25);
    doc.font(options.bold ? 'Helvetica-Bold' : (options.italic ? 'Helvetica-Oblique' : 'Helvetica'))
       .fontSize(options.size || 8.5)
       .fillColor(options.color || C_DARK)
       .text(text, MARGIN_LEFT, doc.y, {
         width: CONTENT_WIDTH,
         lineGap: options.lineGap || 2.5,
         align: options.align || 'left'
       });
    doc.moveDown(0.35);
  }

  function addBullet(label, desc) {
    ensureSpace(20);
    const startY = doc.y;
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_TEAL).text('•', MARGIN_LEFT + 4, startY, { lineBreak: false });
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_DARK).text(`${label}: `, MARGIN_LEFT + 16, startY, { continued: true });
    doc.font('Helvetica').fontSize(8.5).fillColor(C_MUTED).text(desc, { lineGap: 2 });
    doc.moveDown(0.2);
  }

  function addCallout(title, text, type = 'info') {
    ensureSpace(45);
    const bg = type === 'warning' ? '#FEF3C7' : (type === 'success' ? '#DCFCE7' : '#EFF6FF');
    const border = type === 'warning' ? '#F59E0B' : (type === 'success' ? '#16A34A' : '#3B82F6');
    const titleColor = type === 'warning' ? '#92400E' : (type === 'success' ? '#166534' : '#1E40AF');
    const textColor = type === 'warning' ? '#78350F' : (type === 'success' ? '#14532D' : '#1E3A8A');

    const curY = doc.y + 3;
    doc.font('Helvetica-Bold').fontSize(8.5);
    const height = doc.heightOfString(text, { width: CONTENT_WIDTH - 24, lineGap: 2 }) + 24;

    doc.rect(MARGIN_LEFT, curY, CONTENT_WIDTH, height).fill(bg);
    doc.rect(MARGIN_LEFT, curY, 4, height).fill(border);

    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(titleColor).text(title, MARGIN_LEFT + 14, curY + 5, { lineBreak: false });
    doc.font('Helvetica').fontSize(8).fillColor(textColor).text(text, MARGIN_LEFT + 14, curY + 17, {
      width: CONTENT_WIDTH - 24,
      lineGap: 2
    });
    doc.y = curY + height + 5;
  }

  function addTable(headers, rows, colWidths) {
    ensureSpace(45);
    let curY = doc.y + 3;

    // Header
    doc.rect(MARGIN_LEFT, curY, CONTENT_WIDTH, 17).fill(C_NAVY);
    let curX = MARGIN_LEFT;
    headers.forEach((h, i) => {
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_WHITE)
         .text(h, curX + 4, curY + 4, { width: colWidths[i] - 8, align: 'left', lineBreak: false });
      curX += colWidths[i];
    });
    curY += 17;

    // Rows
    rows.forEach((row, rIdx) => {
      doc.font('Helvetica').fontSize(7.5);
      let maxH = 15;
      row.forEach((cell, cIdx) => {
        const h = doc.heightOfString(cell, { width: colWidths[cIdx] - 8, lineGap: 1.5 });
        if (h + 7 > maxH) maxH = h + 7;
      });

      if (curY + maxH > PAGE_HEIGHT - 50) {
        doc.addPage();
        curY = 50;
        // re-render header on new page
        doc.rect(MARGIN_LEFT, curY, CONTENT_WIDTH, 17).fill(C_NAVY);
        let rhX = MARGIN_LEFT;
        headers.forEach((h, i) => {
          doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_WHITE)
             .text(h, rhX + 4, curY + 4, { width: colWidths[i] - 8, align: 'left', lineBreak: false });
          rhX += colWidths[i];
        });
        curY += 17;
      }

      const rowBg = rIdx % 2 === 1 ? '#F8FAFC' : C_WHITE;
      doc.rect(MARGIN_LEFT, curY, CONTENT_WIDTH, maxH).fill(rowBg);
      doc.rect(MARGIN_LEFT, curY, CONTENT_WIDTH, maxH).stroke(C_BORDER);

      let cellX = MARGIN_LEFT;
      row.forEach((cell, cIdx) => {
        const isBold = cIdx === 0;
        doc.font(isBold ? 'Helvetica-Bold' : 'Helvetica')
           .fontSize(7.5)
           .fillColor(isBold ? C_DARK : C_MUTED)
           .text(cell, cellX + 4, curY + 3.5, { width: colWidths[cIdx] - 8, lineGap: 1.5 });
        cellX += colWidths[cIdx];
      });
      curY += maxH;
    });
    doc.y = curY + 5;
  }

  // --- DRAW REPORT CONTENT ---
  drawCoverPage();
  doc.addPage(); // Go to Page 2 for body start

  // 1. Report Title and Business Details
  addSectionHeader(1, 'Report Title and Business Details');
  addParagraph('This comprehensive customer support consulting report provides an operational, tactical, and technological support blueprint for "Helping Hands" — a technology-enabled home healthcare and elderly assistance platform. The report is formulated by the Customer Support Consulting Agent as part of the Final Year B.Tech CSE project "AI Multi Consulting Agent".');
  
  const bDetailsHeaders = ['Specification Key', 'Details / Architectural Mapping', 'Strategic Significance'];
  const bDetailsRows = [
    ['Proposed Business Name', 'Helping Hands Healthcare & Caregiver Services Pvt. Ltd.', 'Brand identity centered on compassionate care, assisted living, and reliability.'],
    ['Industry Sector', 'Home Healthcare, Geriatric Assistance, In-Home Nursing & Physio', 'High-sensitivity, high-trust domain requiring empathetic and swift support.'],
    ['Target Operating Market', 'Tier-1 & Tier-2 Urban Centers (Dual-income households, seniors)', 'Targeting families seeking reliable, background-verified domestic care.'],
    ['Project Module Context', 'AI Customer Support Consulting Agent (Prototype Prototype-01)', 'Specialized independent agent functioning prior to multi-agent manager sync.'],
    ['Consultation Scope', 'Support Channels, Workflows, FAQs, Complaints, Retentions & KPIs', 'Defines the operational backbone for pre-, during-, and post-service interactions.'],
    ['Date of Generation', 'October 12, 2026', 'Official project milestone documentation timestamp.']
  ];
  addTable(bDetailsHeaders, bDetailsRows, [120, 220, 165.28]);

  // 2. Executive Summary
  addSectionHeader(2, 'Executive Summary');
  addParagraph('Customer support in home healthcare and eldercare is fundamentally different from generic e-commerce or SaaS support: inquiries directly impact the physical safety, medical stability, and dignity of beloved family members. Consequently, the support strategy for Helping Hands is architected upon a foundational principle of "Empathy First, Speed Always, Escalation Guaranteed".');
  addParagraph('This blueprint outlines a full-stack, hybrid support architecture. An intelligent AI Tier-1 agent handles repetitive scheduling, service discovery, caregiver verification lookups, and basic FAQs 24/7 across WhatsApp and web channels. Crucially, a deterministic escalation protocol immediately routes any emergency medical signal, caregiver punctuality delay, or clinical distress directly to human On-Duty Care Coordinators within seconds.');
  addCallout('EXECUTIVE STRATEGIC SUMMARY', 
    'Key Takeaways: 1) WhatsApp Business API serves as the primary family-care communication spine; 2) 24/7 Dedicated Voice Helpline is strictly maintained for elderly users and clinical escalation; 3) Deterministic SLA thresholds target <45s First Response Time and <15m Dispatch Emergency Resolution; 4) Modular architecture enables frictionless future synchronization with Marketing, Finance, and Research agents via the AI Manager.',
    'info'
  );

  // 3. Business Understanding and Assumptions
  addSectionHeader(3, 'Business Understanding and Assumptions');
  addSubSection('3.1 Core Products and Service Offerings');
  addBullet('Daily Assisted Eldercare', 'Assistance with mobility, hygiene, bathing, feeding, companionship, and routine vital checks for senior citizens.');
  addBullet('Skilled In-Home Nursing', 'Post-operative recovery, wound dressing, IV infusion, urinary catheter care, and palliative support administered by registered nurses.');
  addBullet('Geriatric & Post-Op Physiotherapy', 'Specialized mobility rehabilitation, stroke recovery, and orthopedic therapy delivered in-home by certified physiotherapists.');
  addBullet('On-Demand Emergency Relief', 'Short-notice temporary caregiver dispatch to relieve family caregivers or provide hospital bedside attendant assistance.');

  addSubSection('3.2 Target Customer Groups & Stakeholder Personas');
  addBullet('Working Adult Children & NRIs (Primary Payers)', 'Aged 28–52, tech-savvy, demanding total visibility, daily reports, and emergency reassurance regarding their parents.');
  addBullet('Senior Citizens & Care Recipients (Direct Consumers)', 'Aged 60+, valuing patience, warmth, clear voice-based communication, and familiar caregiver continuity.');
  addBullet('Caregivers & Certified Nurses (Service Partners)', 'Field supply-side workforce requiring instant support for route tracking, patient emergencies, and shift scheduling.');

  addSubSection('3.3 Customer Lifecycle Interactions');
  addBullet('Pre-Purchase Stage', 'Vetting caregiver certifications, understanding service packages, requesting trial visits, reviewing background check credentials.');
  addBullet('During-Purchase Stage', 'Matching care requirements with suitable attendants, scheduling slots, processing secure payments, KYC exchange.');
  addBullet('Post-Purchase / In-Care Stage', 'Daily care log updates, vitals reporting via WhatsApp, caregiver punctuality monitoring, rescheduling, renewal, feedback.');

  addSubSection('3.4 Explicitly Stated Assumptions');
  addParagraph('To ensure rigorous planning without inventing unconfirmed proprietary terms, this analysis operates under explicitly defined assumptions:');
  addBullet('Assumption 1 (Platform Model)', 'Helping Hands operates a managed marketplace model with mandatory background vetting and clinical training.');
  addBullet('Assumption 2 (Emergency Limits)', 'Helping Hands provides non-critical home care; life-threatening emergencies require hospital emergency ambulance (108) escalation.');
  addBullet('Assumption 3 (Cancellation Policy)', 'Assumes a modeled standard 12-hour advance cancellation window for full credit, balancing family flexibility and caregiver livelihood.');
  addBullet('Assumption 4 (Data Confidentiality)', 'Medical logs are strictly protected under healthcare privacy compliance (HIPAA/DISHA equivalent standards).');

  // 4. Customer Needs Analysis
  addSectionHeader(4, 'Customer Needs Analysis');
  addParagraph('Through structured persona modeling and service vulnerability mapping, customer needs have been categorized across questions, expectations, friction points, and trust drivers.');
  
  const needsHeaders = ['Category', 'Customer Voice & Core Needs', 'Support Operational Strategy'];
  const needsRows = [
    ['Common Questions', '"Are attendants police verified? What if my caregiver is absent? Can we conduct an interview first? How do you monitor vitals?"', 'Standardize instant verification ID retrieval and automated replacement dispatch workflows.'],
    ['Core Expectations', 'Absolute punctuality, respectful bedside manners, hygienic practices, immediate family notifications for abnormal vitals.', 'Implement caregiver geo-fencing check-ins and structured shift handover checklists.'],
    ['Purchase Barriers', 'Hesitation over having a stranger in the house; fear of caregiver neglect; anxiety regarding sudden cancellations; complex pricing.', 'Offer introductory video-call matching, 1-day trial shifts, and transparent all-inclusive tariff cards.'],
    ['Trust Enablers', 'Digital verified badge with police clearance; live caregiver check-in notifications; continuous family WhatsApp care summaries.', 'Provide downloadable caregiver verification dossier prior to every first appointment.']
  ];
  addTable(needsHeaders, needsRows, [100, 220, 185.28]);
  addParagraph('Constraint Note: In accordance with project rules, these insights represent behavioral and support experience analysis. Claims regarding macro market size or commercial demand volumes are deferred to the Research Agent.', { italic: true, size: 7.5, color: C_MUTED });

  // 5. Recommended Support Channels
  addSectionHeader(5, 'Recommended Support Channels');
  addParagraph('An omnichannel support matrix ensures that both elderly individuals (who prefer voice) and working professionals (who prefer instant messaging) receive seamless, rapid assistance.');

  const channelHeaders = ['Channel', 'Target Audience & Use Case', 'Why It Suits Helping Hands', 'Operating SLA'];
  const channelRows = [
    ['WhatsApp Business API', 'Family members & working adult children: daily logs, photo updates, booking modifications.', '95%+ adoption across demographics; allows rich media sharing of prescriptions, vitals, and care summaries.', '< 45 seconds (AI)\n< 3 mins (Human)'],
    ['24/7 Voice Helpline (IVR)', 'Elderly clients, sudden caregiver delays, clinical emergency escalations.', 'Essential for seniors unable to use mobile apps; provides zero-latency human warmth during distress.', '< 20 seconds\nZero dropped calls'],
    ['Web & App AI Chatbot', 'Prospective clients, service inquiries, package comparison, self-service cancellation.', 'Deflects 65%+ routine queries 24/7; reduces operational burn rate during high pre-purchase inquiry spikes.', 'Instantaneous\n(< 3 seconds)'],
    ['Email Support', 'Detailed clinical reports, corporate tie-ups, tax invoices, insurance paperwork, formal grievances.', 'Maintains an immutable audit trail for complex disputes, legal compliance, and long-term medical logs.', '< 2 hours response\n< 12 hours resolution'],
    ['In-App SOS & Live Chat', 'Active caregiver shifts: patient distress, medication questions, caregiver-family sync.', 'Integrated with active GPS tracking and caregiver profile for immediate real-time coordination.', '< 30 seconds priority routing']
  ];
  addTable(channelHeaders, channelRows, [95, 145, 175, 90.28]);

  // 6. Customer Support Workflow
  addSectionHeader(6, 'Customer Support Workflow');
  addParagraph('The operational workflow follows a strict deterministic pipeline: Query Ingestion → Classification → Automated Solution or Escalation → Resolution → Feedback.');

  const workflowHeaders = ['Workflow Step', 'Operational Action', 'Technology & Governance'];
  const workflowRows = [
    ['Step 1: Query Ingestion', 'Omnichannel capture from WhatsApp, Voice Call, Web Chat, or App SOS button.', 'Unified CRM inbox with auto-sync of customer phone, history, and active care plan.'],
    ['Step 2: Classification', 'AI Intent Classifier categorizes query into Emergency (P1), Dispatch (P2), Billing (P3), or FAQ (P4).', 'Natural Language Understanding (NLU) with sentiment analysis and medical urgency keyword triggers.'],
    ['Step 3: Response / Solution', 'P4 FAQs answered instantly by AI. P3 Billing verified with automated ledger check.', 'RAG-powered conversational agent referencing approved care protocols and policies.'],
    ['Step 4: Escalation if Required', 'P1 Emergencies and P2 Delays auto-routed to On-Duty Care Coordinator within 15 seconds.', 'Automated phone dialer rings duty manager; SMS alerts dispatched simultaneously to backup ops.'],
    ['Step 5: Resolution', 'Care coordinator assigns standby caregiver or reconciles billing discrepancy.', 'Action verified directly with family contact; caregiver replacement tracked via GPS.'],
    ['Step 6: Feedback & Audit', 'Automated 1-click CSAT prompt dispatched post-resolution via WhatsApp.', 'Log stored in centralized audit database for AI training and service quality scoring.']
  ];
  addTable(workflowHeaders, workflowRows, [110, 210, 185.28]);

  // 7. FAQs
  addSectionHeader(7, 'Frequently Asked Questions (FAQs)');
  addParagraph('The following 10 FAQs represent the most critical inquiries anticipated from families, framed with explicit policy assumptions to avoid speculative promises.');

  const faqs = [
    ['Q1: How does Helping Hands verify the background and qualifications of caregivers?',
     'Every caregiver undergoes a rigorous 4-step vetting process: government ID check, mandatory local police background verification, nursing/geriatric certification validation, and an in-person clinical skill evaluation by our Senior Nursing Superintendent.'],
    ['Q2: What happens if an assigned caregiver falls ill or is late for a scheduled shift?',
     'We maintain a 15% buffer of "Standby Rapid Responders" in each operational zone. If an attendant is delayed by more than 15 minutes or reports sick, our automated dispatch triggers an immediate notification and dispatches a standby caregiver within 45 minutes.'],
    ['Q3: How are service packages and caregiver pricing structured?',
     'Pricing is categorized into 3 standardized tiers: Companion Care (daily assistance & mobility), Skilled Nursing (injections, catheter, wound dressing), and Intensive Post-Op/Dementia Care. Options include 8-hour, 12-hour, or 24-hour live-in packages with zero hidden fees.'],
    ['Q4: Does Helping Hands provide emergency ambulance or hospital ICU services?',
     'No. Helping Hands specializes in non-critical home health and assisted daily living. For life-threatening emergencies, our protocol mandates immediate dialing of emergency medical services (108/local ambulance) while our support coordinator stays on the line.'],
    ['Q5: Can working children or family members living abroad monitor daily care?',
     'Yes. At the end of every shift (or in real-time for vitals), our caregiver submits a structured Daily Care Log via the app. Family members receive an automated WhatsApp PDF summary covering vitals (BP, sugar, pulse), meals taken, medications administered, and mood.'],
    ['Q6: What payment methods are accepted and how are monthly subscriptions billed?',
     'We accept all major credit/debit cards, UPI, net banking, and automated monthly mandates. Invoices are billed in advance for weekly or monthly packages, with detailed GST-compliant receipts generated for insurance and tax purposes.'],
    ['Q7: What is the rescheduling and cancellation policy for scheduled shifts?',
     'Appointments can be rescheduled or cancelled with up to 12 hours advance notice at zero penalty with full credit returned to your account wallet. Cancellations within 4 hours incur a nominal 30% caregiver compensation allowance.'],
    ['Q8: How do refunds work if care is terminated early due to patient hospitalization?',
     'If care is paused due to unexpected hospitalization or medical events, remaining prepaid days are immediately credited to the family wallet with zero expiration, or processed as a prorated bank refund within 5–7 business days upon written request.'],
    ['Q9: Can we request a caregiver replacement if temperament or personality is not compatible?',
     'Yes. We recognize that eldercare requires strong personal rapport. Families can request a caregiver replacement after the initial shift at zero extra charge. Our Care Coordinator will conduct a brief consultation to match a better-suited profile.'],
    ['Q10: Can we specify gender preferences (male or female caregiver) for personal hygiene care?',
     'Yes. You may specify male or female caregivers during booking for all personal hygiene, bathing, and mobility assistance. We strictly match certified attendants according to family and patient preference.']
  ];

  faqs.forEach(([q, a]) => {
    ensureSpace(32);
    doc.font('Helvetica-Bold').fontSize(8).fillColor(C_NAVY).text(q, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH });
    doc.font('Helvetica').fontSize(8).fillColor(C_DARK).text(a, MARGIN_LEFT, doc.y + 2, {
      width: CONTENT_WIDTH,
      lineGap: 2
    });
    doc.moveDown(0.3);
  });

  // 8. Complaint Management Plan
  addSectionHeader(8, 'Complaint Management Plan');
  addParagraph('Home healthcare complaints require uncompromising accountability. Below are the five primary complaint categories, complete with recommended response scripts, corrective resolutions, and escalation criteria.');

  const complaintHeaders = ['Complaint Scenario', 'Recommended Response Script', 'Operational Resolution', 'Human Escalation'];
  const complaintRows = [
    [
      '1. Caregiver No-Show / Delay >30 mins\n(High Urgency)',
      '"I sincerely apologize for this distressing delay. I am checking the caregiver GPS location right now and alerting our local zone coordinator immediately. You will receive an update in 3 minutes."',
      'Immediate contact with caregiver. If unreachable, deploy Standby Caregiver within 45 mins. Provide 50% credit on that shift as service guarantee.',
      'YES (P2)\nCare Coordinator dispatched within 3 mins.'
    ],
    [
      '2. Inadequate Skill / Rough Bedside Manner\n(Critical Safety)',
      '"We take patient safety and dignity with utmost seriousness. I am noting your exact observations and escalating this to our Senior Nursing Lead immediately. Would you like us to pause the session and send a replacement?"',
      'Immediate phone call from Nursing Lead to assess patient comfort. Caregiver removed from placement, re-evaluated in clinical lab, and replaced with senior certified attendant.',
      'YES (P1)\nEscalated directly to Head of Clinical Nursing.'
    ],
    [
      '3. Billing Dispute / Unexpected Charge\n(Medium Urgency)',
      '"Thank you for bringing this invoice item to our attention. Let me pull up your shift timesheet and billing ledger right now to review the breakdown with you."',
      'Compare digital GPS check-in/out timestamps with billed hours. Correct erroneous surcharges immediately and issue revised invoice within 2 hours.',
      'YES (P3)\nEscalated to Billing Lead if dispute exceeds 500 INR.'
    ],
    [
      '4. Emergency Escalation Failure / Unanswered Call\n(Critical Process)',
      '"I understand how alarming it is when an urgent message goes unanswered. I have triggered our emergency audio-bridge right now and a senior care manager is calling you on this line immediately."',
      'Direct telephony ring to family member. Initiate internal audit of IVR trunk lines; issue incident root-cause report to customer within 24 hours.',
      'YES (P1)\nMandatory immediate call by Operations Director.'
    ],
    [
      '5. App Booking Glitch / Duplicate Payment\n(Low/Medium Urgency)',
      '"I can see the duplicate transaction reference on your profile. Please be assured your money is safe. I have initiated a refund for the duplicate charge right now."',
      'Trigger automated payment gateway refund via Razorpay/Stripe API. Refund reference sent via SMS/WhatsApp within 5 minutes.',
      'NO\nAutomated AI reconciliation; human check if gateway fails.'
    ]
  ];
  addTable(complaintHeaders, complaintRows, [95, 155, 165, 90.28]);

  // 9. Sample AI Conversations
  addSectionHeader(9, 'Sample AI Conversations');
  addParagraph('The following three realistic conversation transcripts illustrate how the AI Support Agent manages pre-purchase vetting, active complaint resolution, and cancellation workflows with empathy and operational precision.');

  addSubSection('Scenario A: Product / Service Inquiry (Dementia Care Attendant)');
  addCallout('CUSTOMER MESSAGE:', 
    '"Hello, my 79-year-old mother was recently diagnosed with early-stage Alzheimer’s. She forgets her medication and gets disoriented in the evenings. Do you have trained attendants for 12-hour daytime shifts, and how do I know they are qualified?"',
    'info'
  );
  addCallout('AI AGENT RESPONSE:', 
    '"Hello! Thank you for reaching out to Helping Hands. We deeply understand how critical patient and specialized care is for individuals with Alzheimer’s.\n\nYes, we provide certified Dementia & Geriatric Care Attendants specifically trained in gentle de-escalation, memory stimulation, medication compliance, and fall prevention for 12-hour shifts (typically 8:00 AM – 8:00 PM).\n\nTo ensure your peace of mind regarding qualifications:\n1. All our dementia attendants hold specialized geriatric patient-care certifications.\n2. Each attendant has verified police clearances and background checks available for your review in the app.\n3. We offer an introductory 30-minute video orientation with the caregiver and our Care Supervisor prior to your first booking.\n\nWould you like me to share our Dementia Care service guide and check caregiver availability in your postal code?"',
    'success'
  );

  addSubSection('Scenario B: Live Service Complaint (Caregiver Delayed for Critical Shift)');
  addCallout('CUSTOMER MESSAGE:', 
    '"This is unacceptable! The attendant Sunita was supposed to arrive at 8:00 AM for my father’s post-stroke sponge bath and breakfast. It is now 8:45 AM, she has not arrived, and she is not picking up her phone! My father is waiting in bed."',
    'warning'
  );
  addCallout('AI AGENT RESPONSE:', 
    '"I am deeply sorry for this delay and the stress this is causing you and your father. This falls completely short of our standard of care.\n\nHere is what I am doing right this second:\n1. I have escalated this directly to our South Zone Duty Coordinator, Vikram, who is calling Sunita’s field supervisor immediately.\n2. I have put a standby verified attendant in your neighborhood on pre-alert.\n\nOur Care Coordinator will call you on this number within 3 minutes with Sunita’s exact location or dispatch confirmation for our standby attendant. You will not be charged for this morning’s delay. Please allow us 3 minutes to resolve this for your father."',
    'warning'
  );

  addSubSection('Scenario C: Refund & Cancellation Request (Hospitalization Pause)');
  addCallout('CUSTOMER MESSAGE:', 
    '"Hi, we purchased a 30-day post-op nursing package for my husband, but he had a complication last night and has been admitted to Apollo Hospital for at least 10 days. We need to cancel the remaining 18 days and get a refund."',
    'info'
  );
  addCallout('AI AGENT RESPONSE:', 
    '"Hello. We are so sorry to hear about your husband’s complication and hospitalization. We hope he recovers swiftly and smoothly.\n\nPlease don’t worry about your booking—we have paused his nursing schedule immediately as of this morning so no shifts will be deducted.\n\nRegarding the remaining 18 days of your package:\n1. Standard Medical Hold: We can keep the 18 days in your Helping Hands Health Wallet with lifetime validity, ready to resume the exact day he is discharged.\n2. Full Prorated Refund: If you prefer an immediate bank refund, I can process the prorated balance for the 18 unused days back to your original payment method (processed within 5–7 business days).\n\nPlease let me know if you would prefer the Medical Wallet Hold or the Bank Refund, and we will take care of it immediately."',
    'success'
  );

  // 10. Customer Satisfaction and Retention Strategy
  addSectionHeader(10, 'Customer Satisfaction and Retention Strategy');
  addParagraph('In healthcare, customer retention is governed by emotional trust and care continuity. Helping Hands employs an ethical, patient-centric retention methodology.');
  
  addSubSection('10.1 Practical Satisfaction Drivers');
  addBullet('Caregiver Continuity Guarantee', 'Maintaining the same matched attendant for >90% of recurring shifts to prevent emotional disruption for vulnerable seniors.');
  addBullet('Daily Digital Vitals Summary', 'Delivering automated, easy-to-read graphical health updates to family members via WhatsApp after each shift.');
  addBullet('Bi-Weekly Supervisory Nurse Audits', 'Unannounced spot-checks by senior clinical supervisors to verify infection control, caregiver hygiene, and patient comfort.');

  addSubSection('10.2 Feedback Collection & Negative Feedback Remediation');
  addBullet('1-Tap WhatsApp Post-Visit CSAT', 'Prompt sent 30 minutes post-shift: "How was today\'s care by [Caregiver]? [1-5 Stars]". High response rate due to low friction.');
  addBullet('Service Recovery Paradox SLA', 'Any rating of 1 or 2 stars triggers an automated SMS apology and a mandatory human phone call from a Senior Care Officer within 30 minutes.');
  addBullet('Fair Resolution Compensation', 'Dissatisfied families receive an instant care credit or complimentary nurse visit, resolving grievances before public reviews.');

  addSubSection('10.3 Target Performance Benchmarks (Industry Standards)');
  const kpiHeaders = ['Key Performance Indicator (KPI)', 'Target Benchmark', 'Measurement Cadence', 'Action Trigger Threshold'];
  const kpiRows = [
    ['Customer Satisfaction Score (CSAT)', '> 92% Positive', 'Daily post-shift micro-surveys', 'Immediate review if rolling CSAT drops < 88%'],
    ['First Response Time (FRT) - Live Channels', '< 45 seconds (Chat/WhatsApp)\n< 20 seconds (Phone)', 'Real-time telemetry monitor', 'Alert if queue wait time exceeds 90 seconds'],
    ['First Response Time (FRT) - Email', '< 2 hours', 'Hourly ticketing audit', 'Escalation to Lead if unassigned after 1 hour'],
    ['First Contact Resolution Rate (FCR)', '72% – 78%', 'Weekly aggregate ticket review', 'Staff re-training if FCR falls < 65%'],
    ['Average Resolution Time (ART) - Dispatch', '< 15 minutes', 'Per incident log', 'Immediate operational investigation if > 25 mins'],
    ['Net Promoter Score (NPS)', '> +65 (Promoters)', 'Quarterly relationship survey', 'Personal call from founders to all detractors']
  ];
  addTable(kpiHeaders, kpiRows, [140, 115, 120, 130.28]);

  // 11. Tools and Resources
  addSectionHeader(11, 'Tools and Implementation Architecture');
  addParagraph('To execute the customer support strategy without claiming pre-existing integration, the following modular technology stack is recommended for phased adoption:');

  const toolHeaders = ['Technology Layer', 'Recommended Tools', 'Key Capability & Strategic Value'];
  const toolRows = [
    ['Omnichannel Helpdesk', 'Freshdesk Omnichannel / Zendesk Suite', 'Unified ticket history combining WhatsApp, email, voice, and app chat into a single customer profile.'],
    ['Conversational AI / NLP Engine', 'Gemini / OpenAI API + LangChain RAG', 'Retrieval-Augmented Generation referencing vetted clinical SOPs, FAQs, and caregiver availability matrices.'],
    ['Cloud Telephony & Priority IVR', 'Exotel / Knowlarity / Twilio Voice', 'Intelligent routing with VIP elderly customer fast-tracking, call recording, and instant failover to duty phones.'],
    ['Messaging Automation', 'WhatsApp Cloud API via Gupshup / Wati', 'High-throughput automated notifications, daily care report PDF delivery, and 1-tap CSAT survey buttons.'],
    ['Operations & Dispatch CRM', 'Custom PostgreSQL / Retool Dashboard', 'Real-time caregiver geofencing, shift check-in timestamps, standby buffer inventory, and incident logging.']
  ];
  addTable(toolHeaders, toolRows, [110, 150, 245.28]);

  // 12. Implementation Roadmap
  addSectionHeader(12, 'Implementation Roadmap');
  addParagraph('A structured 12-week deployment plan ensures a smooth progression from initial foundation to automated, scalable support operations.');

  const roadmapHeaders = ['Phase & Timeline', 'Core Deliverables', 'Operational Milestones'];
  const roadmapRows = [
    [
      'Phase 1: Foundation\n(Weeks 1 – 2)',
      '• Set up Google Workspace & shared support email.\n• Register official WhatsApp Business account.\n• Author initial Standard Operating Procedures (SOPs).',
      'Basic inquiry handling operational; manual call logging in Google Sheets.'
    ],
    [
      'Phase 2: Launch Operations\n(Weeks 3 – 4)',
      '• Deploy Cloud Telephony IVR for emergency calls.\n• Onboard Freshdesk/Zendesk helpdesk.\n• Train 3 Care Coordinators on emergency escalation.',
      '24/7 Voice Hotline live; multi-channel ticket tracking operational.'
    ],
    [
      'Phase 3: AI & Automation\n(Weeks 5 – 8)',
      '• Integrate RAG-powered AI Chatbot for 24/7 web/app FAQs.\n• Connect WhatsApp Cloud API for automated care logs.\n• Deploy 1-tap CSAT survey triggers.',
      '60% FAQ self-service deflection; automated daily family care summaries.'
    ],
    [
      'Phase 4: Scaling & Predictive\n(Weeks 9 – 12)',
      '• Connect caregiver GPS tracking with support dashboard.\n• Automated standby attendant dispatch triggers.\n• AI Manager API integration readiness.',
      'SLA compliance > 95%; automated dispatch delay prediction; full audit logs.'
    ]
  ];
  addTable(roadmapHeaders, roadmapRows, [100, 220, 185.28]);

  // 13. Performance Metrics
  addSectionHeader(13, 'Performance Metrics & Governance Framework');
  addParagraph('Support performance governance relies on a balanced scorecard model assessing Speed, Clinical Quality, Empathy, and Cost-to-Serve.');
  addBullet('Speed Metrics', 'First Response Time (<45s on chat, <20s on phone), Average Speed of Answer, and Dispatch Emergency SLA (<15 mins).');
  addBullet('Quality & Accuracy Metrics', 'Knowledge Base Accuracy (>98%), Zero Hallucination Rate on medical advice, and First Contact Resolution (75%).');
  addBullet('Empathy & Sentiment Metrics', 'CSAT (>92%), Net Promoter Score (>+65), and Sentiment Score tracked across transcripts via NLP sentiment tagging.');
  addBullet('Operational Efficiency Metrics', 'Cost per Resolved Ticket, Chatbot Deflection Rate (60-70%), and Caregiver Shift Fill Rate (98%).');

  // 14. Final Recommendations
  addSectionHeader(14, 'Final Recommendations');
  addSubSection('14.1 Top Five Immediate Actions for Leadership');
  addBullet('1. Deploy Official WhatsApp Business API', 'Establish an official verified WhatsApp brand presence immediately as the primary communication bridge for family care.');
  addBullet('2. Institute Standby Caregiver Buffer', 'Maintain a mandatory 15% standby caregiver roster per geographical zone to eliminate delay and no-show vulnerabilities.');
  addBullet('3. Enforce Deterministic Medical Escalation', 'Ensure the AI chatbot explicitly disclaims critical emergency care and routes medical distress calls to emergency services and human coordinators.');
  addBullet('4. Launch Automated Daily Care Summaries', 'Build immense family trust by providing structured daily vitals and activity logs after every completed shift.');
  addBullet('5. Conduct Empathy & De-escalation Training', 'Mandate 40 hours of empathetic communication and patient de-escalation training for all front-line support coordinators.');

  addSubSection('14.2 Key Operational Risks & Mitigation');
  const riskHeaders = ['Operational Risk', 'Impact Level', 'Mitigation Strategy'];
  const riskRows = [
    ['Caregiver No-Show during critical care', 'CRITICAL', 'Real-time geofence alerts 30 mins before shift; automated standby attendant auto-dispatch.'],
    ['AI Hallucination of medical advice', 'HIGH', 'Strict RAG guardrails: AI is strictly prohibited from diagnosing; canned triage scripts only.'],
    ['Leakage of confidential patient health data', 'HIGH', 'Role-based access control, encrypted patient records, and NDAs signed by all support staff.'],
    ['Burnout of human Care Coordinators', 'MEDIUM', 'Rotational night shifts, AI deflection of routine queries, and structured wellness support.']
  ];
  addTable(riskHeaders, riskRows, [130, 85, 290.28]);

  addSubSection('14.3 Multi-Agent System Integration Demarcation');
  addParagraph('To prepare for integration with the AI Multi Consulting Agent platform, the division of responsibilities is established as follows:');
  addBullet('Customer Support Agent (Current Prototype)', 'Delivers operational workflows, support channels, FAQs, complaint trees, retention frameworks, and SLA matrices.');
  addBullet('Research Agent (Upcoming)', 'Responsible for competitive landscape benchmarking, TAM/SAM sizing, regulatory healthcare compliance, and demographic studies.');
  addBullet('Marketing Agent (Upcoming)', 'Responsible for customer acquisition cost (CAC), lead gen campaigns, brand storytelling, and referral channel expansion.');
  addBullet('Finance Agent (Upcoming)', 'Responsible for pricing elasticity modeling, caregiver unit economics, burn rate, working capital, and 3-year cash flow projections.');
  addBullet('AI Manager (Orchestrator)', 'Synthesizes all four agent outputs, resolves inter-agent resource conflicts, and computes overall venture feasibility.');

  // 15. Implementation Checklist
  addSectionHeader(15, 'Implementation Checklist');
  addParagraph('The operational readiness checklist below serves as an actionable audit for the founding team before launching customer-facing support operations.');

  const checkHeaders = ['Category', 'Action Item / Verification Task', 'Status / Verification Criteria'];
  const checkRows = [
    ['Infrastructure', 'Provision dedicated 1800/local virtual hotline with IVR routing', '[  ] Verified zero-drop telephony trunk'],
    ['Infrastructure', 'Activate WhatsApp Business Cloud API with green checkmark vetting', '[  ] Meta Business verification complete'],
    ['Infrastructure', 'Deploy unified helpdesk ticketing software (Freshdesk/Zendesk)', '[  ] Multi-channel inbox routing active'],
    ['Content & SOPs', 'Draft and approve 50 standard FAQ responses with clinical leads', '[  ] Knowledge base published & indexed'],
    ['Content & SOPs', 'Formalize 5 critical complaint escalation trees and compensation policies', '[  ] Signed off by Operations Director'],
    ['AI Automation', 'Deploy RAG AI Agent with medical boundary guardrails and fallback', '[  ] 100% test pass on safety queries'],
    ['Staffing & Training', 'Recruit and train 3 full-time On-Duty Care Coordinators on empathy', '[  ] Simulation drills completed'],
    ['Field Logistics', 'Establish 15% Standby Caregiver roster in initial launch zones', '[  ] Standby SLA contract agreements signed'],
    ['Governance', 'Implement HIPAA/DISHA-compliant patient data privacy protocols', '[  ] Data security policy signed & enforced'],
    ['Launch Readiness', 'Conduct full end-to-end simulated emergency & booking test calls', '[  ] Readiness sign-off achieved']
  ];
  addTable(checkHeaders, checkRows, [95, 235, 175.28]);

  // --- FOOTERS & HEADERS ON ALL BUFFERED PAGES ---
  const range = doc.bufferedPageRange();
  const totalPages = range.count;

  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);
    doc.page.margins.top = 0;
    doc.page.margins.bottom = 0;

    if (i > 0) { // skip cover page
      // Header line
      doc.rect(MARGIN_LEFT, 25, CONTENT_WIDTH, 0.5).fill(C_BORDER);
      doc.font('Helvetica-Bold').fontSize(7).fillColor(C_NAVY)
         .text('AI MULTI CONSULTING AGENT | CUSTOMER SUPPORT DIVISION', MARGIN_LEFT, 15, { lineBreak: false });
      doc.font('Helvetica').fontSize(7).fillColor(C_MUTED)
         .text('HELPING HANDS CONSULTING REPORT', MARGIN_LEFT, 15, { align: 'right', width: CONTENT_WIDTH, lineBreak: false });

      // Footer line
      doc.rect(MARGIN_LEFT, PAGE_HEIGHT - 32, CONTENT_WIDTH, 0.5).fill(C_BORDER);
      doc.font('Helvetica').fontSize(7).fillColor(C_MUTED)
         .text('Confidential — For Internal & Final Year Project Review Only', MARGIN_LEFT, PAGE_HEIGHT - 24, { lineBreak: false });
      doc.font('Helvetica-Bold').fontSize(7).fillColor(C_NAVY)
         .text(`Page ${i + 1} of ${totalPages}`, MARGIN_LEFT, PAGE_HEIGHT - 24, { align: 'right', width: CONTENT_WIDTH, lineBreak: false });
    }
  }

  doc.end();

  stream.on('finish', () => {
    console.log(`Report successfully generated at: ${outputPath} (Total Pages: ${totalPages})`);
  });
}

generatePDF();
