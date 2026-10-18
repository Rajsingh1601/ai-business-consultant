# AI Multi-Agent Virtual Consulting Platform — AI Manager Agent

An enterprise-grade, multi-agent virtual business consulting system that helps entrepreneurs and business owners evaluate, plan, and establish businesses through autonomous specialized AI agents.

This repository implements the **Central AI Manager Agent** and its **orchestration logic**, coupled with clean integration interfaces for three specialist agents (**Research Agent**, **Marketing Agent**, **Finance Agent**) and an automated documentation handoff interface to the **Customer Support Agent** for executive PDF generation.

---

## 1. System Architecture

```
                                  ┌─────────────────────────────┐
                                  │      Entrepreneur (UI)      │
                                  │   (ChatGPT-Inspired Web)    │
                                  └──────────────┬──────────────┘
                                                 │ Natural Idea Input
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │     Central AI Manager      │
                                  │  - BusinessContext Extract  │
                                  │  - ConsultationPlan Builder │
                                  │  - Validation & Synthesis   │
                                  └──────────────┬──────────────┘
                                                 │
                   ┌─────────────────────────────┼─────────────────────────────┐
                   │ Parallel Dispatch           │ Parallel Dispatch           │ Parallel Dispatch
                   ▼                             ▼                             ▼
       ┌───────────────────────┐     ┌───────────────────────┐     ┌───────────────────────┐
       │     Research Agent    │     │    Marketing Agent    │     │     Finance Agent     │
       │  - Location & Demand  │     │  - Target Personas    │     │  - CapEx & OpEx Calc  │
       │  - Incumbent Analysis │     │  - Acquisition CAC    │     │  - Break-Even Horizon │
       │  - Demographic Perms  │     │  - 30-Day Launch Plan │     │  - Risk Disclaimers   │
       └───────────┬───────────┘     └───────────┬───────────┘     └───────────┬───────────┘
                   │                             │                             │
                   └─────────────────────────────┼─────────────────────────────┘
                                                 │ Completed Specialist Reports
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │ AI Manager Reconciliation   │
                                  │  - Audit Assumptions        │
                                  │  - Cross-Verify Budgets     │
                                  │  - 12-Section Final Report  │
                                  └──────────────┬──────────────┘
                                                 │ Finalized Report Data
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │   Customer Support Agent    │
                                  │  - Multi-Page PDFKit Engine │
                                  │  - Table of Contents, Tables│
                                  └──────────────┬──────────────┘
                                                 │ Downloadable PDF
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │  Final Business Blueprint   │
                                  │ (Interactive UI + PDF File) │
                                  └─────────────────────────────┘
```

---

## 2. Key Components & Implementation

### A. Central AI Manager Agent (`server/src/services/aiManagerService.ts`)
- **Natural Language Parsing**: Analyzes conversational idea submissions (e.g., *"I want to start a cloud kitchen in Agra with ₹10 lakh"*) and extracts structured `BusinessContext`:
  - Business type & sector
  - Proposed location
  - Target customer profile
  - Capital budget / investment constraints
  - Operating objectives & timeline
  - Custom constraints (pure vegetarian, delivery-first, bootstrapped)
- **Clarification Dialogue**: Asks focused follow-up questions only when essential parameters (like business type or target location) are missing. Never invents unverified data.
- **Consultation Plan Generation**: Breaks down the consultation into independent specialist tasks with specific instructions and dependencies.
- **Validation & Reconciliation Engine**: Audits agent reports for conflicting assumptions, verifies capital allocation against initial budgets, and flags unverified claims.
- **12-Section Synthesizer**: Compiles all findings into the 12 standardized consulting sections.

### B. Specialist Agent Interfaces (`server/src/adapters/`)
- Clean integration interfaces implemented via `BaseSpecialistAgentAdapter`:
  - `ResearchAgentAdapter`: Analyzes localized demand, competitors, zoning, and demographic catchments.
  - `MarketingAgentAdapter`: Profiles customer personas, acquisition channels, benchmark CAC ranges, and 30-day launch campaigns.
  - `FinanceAgentAdapter`: Models initial CapEx, recurring OpEx, revenue projections, unit economics, and break-even order thresholds.
- **Reliability Safeguards**: Demonstrations and benchmark heuristics are explicitly labeled with `provenance: 'demonstration_mock'` or `'explicit_assumption'`. Never presents unverified estimates as guaranteed real-world data.

### C. Customer Support Agent Handoff (`server/src/adapters/customerSupportAdapter.ts`)
- Receives the finalized `FinalBusinessReport` via `generateReport(reportData)`.
- Renders a multi-page, executive-grade PDF using `PDFKit` with:
  - Official cover page and metadata specification
  - Formatted tables for CapEx and OpEx breakdowns
  - Competitor matrices and persona cards
  - Risk scoring and phased implementation roadmap
  - Regulatory disclaimers and field validation checklist
- Serves the compiled PDF directly through `GET /api/consultations/:id/pdf`.

### D. Multi-Agent Orchestration Service (`server/src/services/orchestrationService.ts`)
- Dispatches independent specialist tasks concurrently in parallel.
- Real-time status tracking across 5 discrete agent states:
  - **AI Manager**: `Idle` | `Planning` | `Coordinating` | `Reviewing` | `Completed` | `Failed`
  - **Research Agent**: `Waiting` | `Running` | `Completed` | `Failed`
  - **Marketing Agent**: `Waiting` | `Running` | `Completed` | `Failed`
  - **Finance Agent**: `Waiting` | `Running` | `Completed` | `Failed`
  - **Customer Support Agent**: `Waiting` | `Generating PDF` | `Completed` | `Failed`
- **Targeted Task Retry**: Allows retrying any individual failed specialist task without unnecessarily rerunning tasks that have already completed.

### E. ChatGPT-Inspired Web Interface (`frontend/`)
- **Responsive Layout**: Collapsible sidebar, mobile menu toggle, clean dark slate palette.
- **Sidebar**:
  - "+ New Consultation" button
  - Searchable session history filter
  - Inline session renaming & deletion
  - User settings & architecture modal
- **Welcome Screen**:
  - Centered hero: *"Your AI Business Consultant"*
  - Subtitle: *"Turn your business idea into a structured, research-driven business plan."*
  - 4 suggested prompt cards (Cafe in Agra, Online Clothing, Manufacturing in Noida, Startup Feasibility).
- **Agent Status Dashboard**:
  - Compact header activity panel showing live status badges for all 5 agents based on actual workflow events.
  - Expandable task inspector displaying Task ID, input instructions, output summary, and targeted retry button.
- **12-Section Strategic Report Viewer**:
  - Interactive multi-tab browser covering all 12 standardized sections.
  - One-click "Download Official PDF Report" button.
- **Message Composer**:
  - Fixed-bottom multiline textarea with auto-expansion, Enter-to-send, and Shift+Enter for newlines.

---

## 3. Data Contracts & Interfaces

| Interface | Purpose |
| :--- | :--- |
| `BusinessContext` | Structured business parameters extracted by the AI Manager |
| `ConsultationPlan` | Specialist agent execution graph and task dependencies |
| `AgentTask` | Distinct task assigned to a specialist (ID, instructions, input, output, error, retry count) |
| `AgentResult` | Standardized specialist report output with reliability provenance metadata |
| `FinalBusinessReport` | 12 standardized business consultation sections synthesized by AI Manager |
| `AgentStatusDashboardState` | Live status across AI Manager, Research, Marketing, Finance, and Customer Support |

---

## 4. 12 Standardized Report Sections

1. **Executive Summary**
2. **Business Idea and Objectives**
3. **Location and Market Research**
4. **Competitor Analysis**
5. **Target Audience**
6. **Marketing and Customer Acquisition Strategy**
7. **Startup Cost Estimates (CapEx Breakdown)**
8. **Revenue and Operating Expense Projections (OpEx Breakdown)**
9. **Break-Even Analysis**
10. **Risks and Mitigation Strategies**
11. **Recommended Action Plan (Phased Roadmap)**
12. **Data Sources, Assumptions, and Limitations**

---

## 5. Getting Started & Running

### Prerequisites
- Node.js (v18+ or v24 recommended)
- npm (v10+ or v11)

### Installation
Dependencies are already installed in the root and frontend:
```bash
# If running fresh:
npm install
npm --prefix frontend install
```

### Running the System
You can run the backend server and frontend development client:

```bash
# Start backend Express server (Port 5000)
npm run server

# Start frontend Vite dev server (Port 3000, with proxy to 5000)
npm run client

# Or build client for static production serving by Express:
npm run build:client
npm start
```

Open `http://localhost:5000` (or `http://localhost:3000` in dev mode) in your browser to experience the platform.
