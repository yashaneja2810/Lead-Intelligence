import { ReportData } from '../types';

export const generateReportHTML = (data: ReportData): string => {
  const { lead, insights, scrapedData, generatedAt } = data;
  const formatDate = new Date(generatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const renderList = (items: string[]) => {
    if (!items || items.length === 0) {
      return '<li>No data available</li>';
    }
    return items.map((item) => `<li>${item}</li>`).join('');
  };

  const confidenceScore = Math.max(0, Math.min(100, insights.confidence.overall || 0));

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Business Audit Report - ${lead.companyName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
      line-height: 1.45;
      color: #1f2937;
      background: #ffffff;
      font-size: 11.5px;
    }

    .report {
      width: 100%;
      padding: 10px 8px;
    }

    .header {
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 16px 18px;
      margin-bottom: 12px;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 16px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }

    .title {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      letter-spacing: 0.2px;
    }

    .subtitle {
      font-size: 12px;
      color: #4b5563;
      margin-top: 3px;
    }

    .report-id {
      font-size: 10px;
      color: #6b7280;
      text-align: right;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
    }

    .meta-item {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 8px;
      background: #f9fafb;
    }

    .meta-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6b7280;
      margin-bottom: 3px;
    }

    .meta-value {
      font-size: 11px;
      font-weight: 600;
      color: #111827;
      word-break: break-word;
    }

    .section {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 10px;
      page-break-inside: avoid;
      background: #ffffff;
    }

    .section-title {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 6px;
      margin-bottom: 8px;
    }

    p {
      margin-bottom: 8px;
      line-height: 1.5;
    }

    .executive-summary {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 10px;
    }

    .score-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      margin-top: 8px;
    }

    .score-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 8px;
    }

    .score-label {
      font-size: 9px;
      font-weight: 700;
      color: #4b5563;
      text-transform: uppercase;
      letter-spacing: 0.45px;
      margin-bottom: 4px;
    }

    .score-value {
      font-size: 21px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 4px;
    }

    .score-bar {
      width: 100%;
      height: 5px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }

    .score-fill {
      height: 100%;
      background: #4b5563;
      border-radius: 4px;
    }

    .two-col {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .insight-list {
      list-style: disc;
      margin: 6px 0 0 18px;
    }

    .insight-list li {
      padding: 3px 0;
      margin-bottom: 2px;
    }

    .opportunity-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 9px;
      margin-bottom: 7px;
    }

    .opportunity-title {
      font-size: 11.5px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 4px;
    }

    .opportunity-description {
      font-size: 10.5px;
      color: #374151;
      margin-bottom: 6px;
    }

    .opportunity-meta {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
      font-size: 10px;
      color: #4b5563;
    }

    .badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      font-size: 9px;
      border: 1px solid;
    }

    .badge-high {
      background: #f3f4f6;
      color: #111827;
      border-color: #9ca3af;
    }

    .badge-medium {
      background: #f9fafb;
      color: #1f2937;
      border-color: #d1d5db;
    }

    .badge-low {
      background: #f3f4f6;
      color: #4b5563;
      border-color: #d1d5db;
    }

    .quick-win {
      border: 1px solid #e5e7eb;
      padding: 8px;
      margin-bottom: 7px;
      border-radius: 6px;
      background: #f9fafb;
    }

    .quick-win-title {
      font-size: 11.5px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 4px;
    }

    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 6px;
    }

    .tech-badge {
      background: #f3f4f6;
      color: #111827;
      border: 1px solid #d1d5db;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 600;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 7px;
      margin-top: 8px;
    }

    .info-card {
      background: #f9fafb;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }

    .info-label {
      font-size: 9px;
      font-weight: 700;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 3px;
    }

    .info-value {
      font-size: 11px;
      font-weight: 600;
      color: #111827;
      line-height: 1.35;
    }

    .confidence {
      margin-top: 8px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 8px;
      background: #f9fafb;
    }

    .confidence-title {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #6b7280;
      margin-bottom: 4px;
      font-weight: 700;
    }

    .confidence-value {
      font-size: 12px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 4px;
    }

    .confidence-reason {
      font-size: 10px;
      color: #4b5563;
    }

    .footer {
      margin-top: 6px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 10px;
      background: #f9fafb;
      color: #4b5563;
      font-size: 10px;
      line-height: 1.4;
    }

    .footer strong {
      color: #111827;
    }

    @page {
      size: A4;
      margin: 12mm;
    }

    @media print {
      .section,
      .header,
      .footer {
        page-break-inside: avoid;
      }

      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="report">
    <div class="header">
      <div class="header-top">
        <div>
          <div class="title">Business Audit Report</div>
          <div class="subtitle">Digital Performance, Experience, and Strategic Optimization</div>
        </div>
        <div class="report-id">Report ID: ${data.reportId}</div>
      </div>
      <div class="meta-grid">
        <div class="meta-item">
          <div class="meta-label">Company</div>
          <div class="meta-value">${lead.companyName}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Prepared For</div>
          <div class="meta-value">${lead.name}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Industry</div>
          <div class="meta-value">${lead.industry}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Date</div>
          <div class="meta-value">${formatDate}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Executive Summary</div>
      <div class="executive-summary">
        <p>${insights.executiveSummary || `This audit analyzes ${lead.companyName}'s digital presence and identifies practical opportunities for growth, optimization, and operational improvement.`}</p>
      </div>

      <div class="section-title" style="margin-top: 10px;">Overall Assessment Scores</div>
    <div class="score-grid">
      <div class="score-card">
        <div class="score-label">AI Readiness</div>
        <div class="score-value">${insights.scores.aiReadiness}</div>
        <div class="score-bar">
          <div class="score-fill" style="width: ${insights.scores.aiReadiness}%"></div>
        </div>
      </div>
      <div class="score-card">
        <div class="score-label">SEO Health</div>
        <div class="score-value">${insights.scores.seoHealth}</div>
        <div class="score-bar">
          <div class="score-fill" style="width: ${insights.scores.seoHealth}%"></div>
        </div>
      </div>
      <div class="score-card">
        <div class="score-label">UX Quality</div>
        <div class="score-value">${insights.scores.uxQuality}</div>
        <div class="score-bar">
          <div class="score-fill" style="width: ${insights.scores.uxQuality}%"></div>
        </div>
      </div>
      <div class="score-card">
        <div class="score-label">Automation Potential</div>
        <div class="score-value">${insights.scores.automationPotential}</div>
        <div class="score-bar">
          <div class="score-fill" style="width: ${insights.scores.automationPotential}%"></div>
        </div>
      </div>
      <div class="score-card">
        <div class="score-label">Technical Maturity</div>
        <div class="score-value">${insights.scores.technicalMaturity}</div>
        <div class="score-bar">
          <div class="score-fill" style="width: ${insights.scores.technicalMaturity}%"></div>
        </div>
      </div>
    </div>

      <div class="confidence">
        <div class="confidence-title">Confidence</div>
        <div class="confidence-value">${confidenceScore}%</div>
        <div class="confidence-reason">${insights.confidence.reasoning || 'Assessment based on available website and context data.'}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Company Overview</div>
    
      <p>${insights.companySummary || `${lead.companyName} is evaluated as a ${insights.businessMaturity} organization in ${insights.industry}.`}</p>

      <div class="info-grid">
        <div class="info-card">
          <div class="info-label">Business Type</div>
          <div class="info-value">${insights.businessType}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Industry</div>
          <div class="info-value">${insights.industry}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Target Audience</div>
          <div class="info-value">${insights.targetAudience}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Business Maturity</div>
          <div class="info-value">${insights.businessMaturity}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Product Category</div>
          <div class="info-value">${insights.productCategory}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Revenue Model</div>
          <div class="info-value">${insights.revenueModel}</div>
        </div>
      </div>

      <div class="two-col">
        <div>
          <div class="section-title" style="margin-top: 6px;">Core Strengths</div>
          <ul class="insight-list">
            ${renderList(insights.strengths)}
          </ul>
        </div>

        <div>
          <div class="section-title" style="margin-top: 6px;">Areas for Improvement</div>
          <ul class="insight-list">
            ${renderList(insights.weaknesses)}
          </ul>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">SEO Analysis</div>

      <div class="score-card" style="max-width: 220px; margin-bottom: 8px;">
        <div class="score-label">SEO Health Score</div>
        <div class="score-value">${insights.seoInsights.score}</div>
        <div class="score-bar">
          <div class="score-fill" style="width: ${insights.seoInsights.score}%"></div>
        </div>
      </div>

      <div class="two-col">
        <div>
          <div class="section-title" style="margin-top: 6px;">Key SEO Issues</div>
          <ul class="insight-list">
            ${renderList(insights.seoInsights.issues)}
          </ul>
        </div>
        <div>
          <div class="section-title" style="margin-top: 6px;">SEO Recommendations</div>
          <ul class="insight-list">
            ${renderList(insights.seoInsights.recommendations)}
          </ul>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">User Experience Analysis</div>

      <div class="score-card" style="max-width: 220px; margin-bottom: 8px;">
        <div class="score-label">UX Quality Score</div>
        <div class="score-value">${insights.uxAnalysis.score}</div>
        <div class="score-bar">
          <div class="score-fill" style="width: ${insights.uxAnalysis.score}%"></div>
        </div>
      </div>

      <div class="two-col">
        <div>
          <div class="section-title" style="margin-top: 6px;">UX Strengths</div>
          <ul class="insight-list">
            ${renderList(insights.uxAnalysis.strengths)}
          </ul>
        </div>

        <div>
          <div class="section-title" style="margin-top: 6px;">UX Weaknesses</div>
          <ul class="insight-list">
            ${renderList(insights.uxAnalysis.weaknesses)}
          </ul>
        </div>
      </div>

      <div class="section-title" style="margin-top: 8px;">UX Recommendations</div>
      <ul class="insight-list">
        ${renderList(insights.uxAnalysis.recommendations)}
      </ul>
    </div>

    <div class="section">
      <div class="section-title">AI Opportunities</div>
      <p style="margin-bottom: 7px;">Prioritized opportunities aligned to ${lead.companyName}'s business context:</p>

      ${insights.aiOpportunities.length > 0 ? insights.aiOpportunities.map((opp) => `
        <div class="opportunity-card">
          <div class="opportunity-title">${opp.title}</div>
          <div class="opportunity-description">${opp.description}</div>
          <div class="opportunity-meta">
            <span class="badge badge-${opp.priority}">${opp.priority} priority</span>
            <span>Impact: ${opp.impact}</span>
          </div>
        </div>
      `).join('') : '<p>No AI opportunities were identified in this run.</p>'}
    </div>

    <div class="section">
      <div class="section-title">Quick Wins</div>
      <p style="margin-bottom: 7px;">High-value actions that can be executed rapidly:</p>

      ${insights.quickWins.length > 0 ? insights.quickWins.map((win) => `
        <div class="quick-win">
          <div class="quick-win-title">${win.title}</div>
          <p>${win.description}</p>
          <p style="font-size: 10px; color: #4b5563; margin-top: 4px;"><strong>Effort:</strong> ${win.effort} | <strong>Impact:</strong> ${win.impact}</p>
        </div>
      `).join('') : '<p>No quick wins were identified in this run.</p>'}
    </div>

    <div class="section">
      <div class="section-title">Technical Stack and Site Features</div>

      <div class="section-title" style="margin-top: 0;">Detected Technologies</div>
      <div class="tech-stack">
        ${scrapedData.techStack.length > 0
          ? scrapedData.techStack.map((tech) => `<span class="tech-badge">${tech}</span>`).join('')
          : '<span class="tech-badge">No specific technologies detected</span>'}
      </div>

      <div class="section-title" style="margin-top: 8px;">Website Features</div>
      <ul class="insight-list" style="margin-top: 2px;">
        <li>Chat Widget: ${scrapedData.hasChat ? 'Implemented' : 'Not detected'}</li>
        <li>Blog or Content Hub: ${scrapedData.hasBlog ? 'Present' : 'Not found'}</li>
        <li>Mobile Responsiveness: ${scrapedData.isMobileResponsive ? 'Likely supported' : 'Needs validation'}</li>
        <li>Testimonials: ${scrapedData.testimonials.length > 0 ? 'Present' : 'Not found'}</li>
        <li>Pricing Information: ${scrapedData.pricingContent.length > 0 ? 'Available' : 'Not clearly visible'}</li>
      </ul>
    </div>

    <div class="section">
      <div class="section-title">Strategic Recommendations</div>
      <ul class="insight-list">
        ${renderList(insights.strategicRecommendations)}
      </ul>

      <div class="section-title" style="margin-top: 8px;">Conclusion</div>
      <div class="executive-summary">
        <p>${lead.companyName} has clear opportunities to improve performance, experience quality, and operational efficiency. Prioritizing quick wins first, then sequencing medium-term improvements, will provide measurable progress with controlled effort.</p>
      </div>
    </div>

    <div class="footer">
      <p><strong>Lead Enrichment Platform</strong></p>
      <p>Generated: ${new Date(generatedAt).toLocaleString()}</p>
      <p>This report is confidential and intended for ${lead.name} at ${lead.companyName}.</p>
    </div>
  </div>
</body>
</html>
  `;
};
