import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign, 
  Layers, 
  MapPin, 
  Users, 
  Target, 
  TrendingUp, 
  Calendar, 
  ChevronRight,
  Info
} from 'lucide-react';
import type { FinalBusinessReport } from '../types';

interface ReportViewerProps {
  report: FinalBusinessReport;
  onClose?: () => void;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ report, onClose }) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  const sections = [
    { id: 1, title: '1. Executive Summary', icon: Layers },
    { id: 2, title: '2. Idea & Objectives', icon: Target },
    { id: 3, title: '3. Market Research', icon: MapPin },
    { id: 4, title: '4. Competitor Analysis', icon: Users },
    { id: 5, title: '5. Target Audience', icon: Users },
    { id: 6, title: '6. Marketing & Acquisition', icon: Target },
    { id: 7, title: '7. Startup Cost Estimates', icon: DollarSign },
    { id: 8, title: '8. Revenue & Expense', icon: TrendingUp },
    { id: 9, title: '9. Break-Even Analysis', icon: DollarSign },
    { id: 10, title: '10. Risks & Mitigation', icon: AlertTriangle },
    { id: 11, title: '11. Action Plan', icon: Calendar },
    { id: 12, title: '12. Assumptions & Limits', icon: Info },
  ];

  const currSym = report.startupCostEstimates.currency === 'INR' ? '₹' : '$';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-4 max-w-5xl mx-auto w-full transition-colors">
      {/* Top Header Card */}
      <div className="bg-slate-50 dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/40 p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              AI Multi-Agent Feasibility Blueprint
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-500 dark:text-slate-400 text-xs">
              ID: {report.reportId}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {report.businessName}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Synthesized by Central AI Manager • Customer Support PDF Compiled
          </p>
        </div>

        {/* Action Button: PDF Download */}
        <div className="flex items-center gap-2.5">
          {report.pdfExport?.status === 'Completed' && report.pdfExport.downloadUrl ? (
            <a
              href={report.pdfExport.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all shadow-md active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF Report</span>
            </a>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs border border-slate-200 dark:border-slate-700">
              <FileText className="w-3.5 h-3.5" />
              <span>Customer Support Agent: Waiting (Pending Integration)</span>
            </div>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Main Body with Section Selector & Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 lg:col-span-3 border-r border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-2 overflow-y-auto max-h-[600px]">
          <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1.5">
            12 Standardized Sections
          </div>
          <div className="space-y-0.5">
            {sections.map((s) => {
              const IconComp = s.icon;
              const isActive = activeTab === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveTab(s.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <IconComp className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="truncate">{s.title}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0 text-blue-600 dark:text-blue-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Content Area */}
        <div className="md:col-span-8 lg:col-span-9 p-5 sm:p-6 overflow-y-auto max-h-[600px] bg-white dark:bg-slate-900/40 space-y-4">
          {/* Section 1: Executive Summary */}
          {activeTab === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Executive Summary</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium">
                  Manager Reconciled
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {report.executiveSummary.content}
              </p>
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 block">Strategic Key Highlights</span>
                <ul className="space-y-1.5">
                  {report.executiveSummary.keyHighlights.map((h, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-teal-600 dark:text-teal-400 mt-0.5 font-bold">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Section 2: Business Idea and Objectives */}
          {activeTab === 2 && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">2. Business Idea and Objectives</h3>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {report.businessIdeaAndObjectives.content}
              </p>
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">Long-Term Vision</span>
                <p className="text-xs text-slate-700 dark:text-slate-300">{report.businessIdeaAndObjectives.vision}</p>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-200">Core Objectives</span>
                <ul className="space-y-1">
                  {report.businessIdeaAndObjectives.objectives.map((o, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Section 3: Location and Market Research */}
          {activeTab === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">3. Location and Market Research</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                  report.locationAndMarketResearch.status === 'pending'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                }`}>
                  {report.locationAndMarketResearch.status === 'pending' ? 'Pending Specialist Integration' : 'Benchmark Synthesis'}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {report.locationAndMarketResearch.content}
              </p>
              {report.locationAndMarketResearch.status === 'pending' ? (
                <div className="p-4 rounded-xl border border-dashed border-amber-300 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 text-xs text-amber-800 dark:text-amber-300">
                  <p className="font-semibold mb-1">Research Agent Queued in Waiting State</p>
                  <p>Detailed localized footfall analysis, zoning permissions, and demographic modeling will be conducted when the Market Research Specialist Agent is activated.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="font-semibold text-blue-600 dark:text-blue-400 block mb-1">Local Demographics</span>
                    <p className="text-slate-600 dark:text-slate-300 text-xs">{report.locationAndMarketResearch.localDemographics}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="font-semibold text-teal-600 dark:text-teal-400 block mb-1">Foot Traffic & Zoning</span>
                    <p className="text-slate-600 dark:text-slate-300 text-xs">{report.locationAndMarketResearch.footTrafficAndZoning}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section 4: Competitor Analysis */}
          {activeTab === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">4. Competitor Analysis</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                  report.competitorAnalysis.status === 'pending'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                }`}>
                  {report.competitorAnalysis.status === 'pending' ? 'Pending Specialist Integration' : 'Completed'}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {report.competitorAnalysis.content}
              </p>
              {report.competitorAnalysis.status === 'pending' ? (
                <div className="p-4 rounded-xl border border-dashed border-amber-300 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 text-xs text-amber-800 dark:text-amber-300">
                  <p className="font-semibold mb-1">Competitor Screening Queued in Waiting State</p>
                  <p>Direct and indirect incumbent audits, pricing benchmarks, and competitive positioning will be populated when the Research Agent is triggered.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {report.competitorAnalysis.directCompetitors.map((c, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-slate-900 dark:text-slate-200">{c.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 font-medium">
                          {c.pricePoint}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                        <div><strong className="text-emerald-600 dark:text-emerald-400">Strengths:</strong> {c.strengths}</div>
                        <div><strong className="text-rose-600 dark:text-rose-400">Weaknesses:</strong> {c.weaknesses}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section 5: Target Audience */}
          {activeTab === 5 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">5. Target Audience Personas</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                  report.targetAudience.status === 'pending'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
                }`}>
                  {report.targetAudience.status === 'pending' ? 'Pending Specialist Integration' : 'Completed'}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {report.targetAudience.content}
              </p>
              {report.targetAudience.personas?.length > 0 ? (
                <div className="space-y-3">
                  {report.targetAudience.personas.map((p, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                      <span className="font-semibold text-teal-600 dark:text-teal-400 block">{p.segment}</span>
                      <div className="text-slate-700 dark:text-slate-300"><strong className="text-slate-500">Demographics:</strong> {p.demographics}</div>
                      <div className="text-slate-700 dark:text-slate-300"><strong className="text-slate-500">Pain Points:</strong> {p.painPoints}</div>
                      <div className="text-slate-700 dark:text-slate-300"><strong className="text-slate-500">Willingness to Pay:</strong> {p.willingnessToPay}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 italic">
                  Marketing Specialist Agent is queued for subsequent integration. This section will be populated once connected.
                </div>
              )}
            </div>
          )}

          {/* Section 6: Marketing and Customer Acquisition Strategy */}
          {activeTab === 6 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">6. Marketing & Customer Acquisition Strategy</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                  report.marketingAndCustomerAcquisition.status === 'pending'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
                }`}>
                  {report.marketingAndCustomerAcquisition.status === 'pending' ? 'Pending Specialist Integration' : 'Completed'}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {report.marketingAndCustomerAcquisition.content}
              </p>
              {report.marketingAndCustomerAcquisition.channels?.length > 0 ? (
                <>
                  <div className="space-y-2.5">
                    {report.marketingAndCustomerAcquisition.channels.map((ch, i) => (
                      <div key={i} className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-900 dark:text-slate-200">{ch.channel}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium">
                            {ch.estimatedCac}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px]">{ch.tactics}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="font-semibold text-slate-900 dark:text-slate-200 block mb-1">Launch Campaign</span>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">{report.marketingAndCustomerAcquisition.launchCampaign}</p>
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 italic">
                  Marketing Specialist Agent is queued for subsequent integration. This section will be populated once connected.
                </div>
              )}
            </div>
          )}

          {/* Section 7: Startup Cost Estimates */}
          {activeTab === 7 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">7. Startup Cost Estimates (CapEx)</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                  report.startupCostEstimates.status === 'pending'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
                }`}>
                  {report.startupCostEstimates.status === 'pending' ? 'Pending Specialist Integration' : 'Completed'}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {report.startupCostEstimates.content}
              </p>
              {report.startupCostEstimates.lineItems?.length > 0 ? (
                <>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-slate-950 p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">Total Estimated Startup Capital</span>
                      <span className="text-xl font-bold text-slate-900 dark:text-white">
                        {currSym}{report.startupCostEstimates.totalEstimatedStartupCost.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-right text-xs text-amber-600 dark:text-amber-400 max-w-xs font-medium">
                      {report.startupCostEstimates.budgetVariance}
                    </div>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-[11px]">
                        <tr>
                          <th className="p-2.5">Category</th>
                          <th className="p-2.5">Description</th>
                          <th className="p-2.5 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900/50">
                        {report.startupCostEstimates.lineItems.map((li, i) => (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="p-2.5 font-medium text-slate-900 dark:text-slate-200">{li.category}</td>
                            <td className="p-2.5 text-slate-500 dark:text-slate-400 text-[11px]">{li.description}</td>
                            <td className="p-2.5 text-right font-mono text-slate-900 dark:text-slate-200">
                              {currSym}{li.amount.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 italic">
                  Finance Specialist Agent is queued for subsequent integration. Detailed CapEx calculations will be generated once connected.
                </div>
              )}
            </div>
          )}

          {/* Section 8: Revenue and Operating Expense Projections */}
          {activeTab === 8 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">8. Revenue & Expense Projections</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                  report.revenueAndExpenseProjections.status === 'pending'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
                }`}>
                  {report.revenueAndExpenseProjections.status === 'pending' ? 'Pending Specialist Integration' : 'Completed'}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {report.revenueAndExpenseProjections.content}
              </p>
              {report.revenueAndExpenseProjections.monthlyOperatingExpenses > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Monthly Operating Expenses (OpEx)</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {currSym}{report.revenueAndExpenseProjections.monthlyOperatingExpenses.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Projected Monthly Revenue Range</span>
                    <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
                      {currSym}{report.revenueAndExpenseProjections.monthlyRevenueScenarioMin.toLocaleString('en-IN')} – {currSym}{report.revenueAndExpenseProjections.monthlyRevenueScenarioMax.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 italic">
                  Finance Specialist Agent is queued for subsequent integration. Monthly operating cash flow modeling will appear once connected.
                </div>
              )}
            </div>
          )}

          {/* Section 9: Break-Even Analysis */}
          {activeTab === 9 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">9. Break-Even Analysis</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                  report.breakEvenAnalysis.status === 'pending'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
                }`}>
                  {report.breakEvenAnalysis.status === 'pending' ? 'Pending Specialist Integration' : 'Completed'}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {report.breakEvenAnalysis.content}
              </p>
              {report.breakEvenAnalysis.status !== 'pending' && report.breakEvenAnalysis.fixedCostsMonthly > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-1">Break-Even Horizon</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">{report.breakEvenAnalysis.estimatedMonthsToBreakEven}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-1">Avg Order Value</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">{report.breakEvenAnalysis.averageOrderValue}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-1">Orders Needed/Mo</span>
                    <span className="text-base font-bold text-teal-600 dark:text-teal-400">{report.breakEvenAnalysis.monthlyOrdersNeeded}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 italic">
                  Finance Specialist Agent is queued for subsequent integration. Unit economics and break-even order volume will appear once connected.
                </div>
              )}
            </div>
          )}

          {/* Section 10: Risks and Mitigation Strategies */}
          {activeTab === 10 && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">10. Risks & Mitigation Strategies</h3>
              </div>
              <div className="space-y-3">
                {report.risksAndMitigationStrategies.risks.map((r, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-slate-200">{r.risk}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        r.severity === 'High' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                        {r.severity} Severity
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400"><strong className="text-slate-700 dark:text-slate-300">Mitigation:</strong> {r.mitigation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 11: Recommended Action Plan */}
          {activeTab === 11 && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">11. Recommended Action Plan</h3>
              </div>
              <div className="space-y-3">
                {report.recommendedActionPlan.phases.map((ph, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-600 dark:text-blue-400">{ph.phase}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        {ph.timeline}
                      </span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                      {ph.keyMilestones.map((m, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-teal-500 shrink-0" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/80">
                      <strong className="text-slate-700 dark:text-slate-300">Deliverable:</strong> {ph.deliverable}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 12: Data Sources, Assumptions, and Limitations */}
          {activeTab === 12 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">12. Data Sources, Assumptions & Limitations</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-medium">
                  Compliance & Reliability
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {report.dataSourcesAssumptionsAndLimitations.content}
              </p>
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-amber-600 dark:text-amber-400">Items Requiring Ground Validation</span>
                <ul className="space-y-1">
                  {report.dataSourcesAssumptionsAndLimitations.itemsNeedingValidation.map((item, i) => (
                    <li key={i} className="text-slate-700 dark:text-slate-300 text-[11px] flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl text-[11px] text-rose-700 dark:text-rose-300 leading-relaxed">
                {report.dataSourcesAssumptionsAndLimitations.limitationsNote}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
