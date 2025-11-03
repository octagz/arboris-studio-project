import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const RISK_LEVEL_STYLES = {
  HIGH: 'rr-risk-high',
  MEDIUM: 'rr-risk-medium',
  LOW: 'rr-risk-low',
};

const REPORT_STYLES = `
  :root {
    color-scheme: only light;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    background: #f0f4f5;
  }

  .rr-report-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    max-width: 900px;
    margin: 0 auto;
    padding: 32px 40px;
    color: #1f2937;
    background: #ffffff;
  }

  .rr-title {
    color: #0f172a;
    border-bottom: 3px solid #2563eb;
    padding-bottom: 12px;
    margin: 0 0 12px;
    font-size: 32px;
  }

  .rr-timestamp {
    color: #64748b;
    font-size: 13px;
    margin: 4px 0;
  }

  .rr-section-heading {
    color: #111827;
    font-size: 22px;
    margin: 36px 0 12px;
  }

  .rr-body-text {
    font-size: 15px;
    color: #334155;
    margin: 0 0 18px;
  }

  .rr-context {
    background: #f8fafc;
    border-left: 4px solid #2563eb;
    padding: 18px 22px;
    border-radius: 10px;
    margin-top: 24px;
  }

  .rr-context .rr-body-text {
    margin-bottom: 0;
  }

  .rr-branch-card {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 24px;
    margin: 26px 0;
    background: #f8fafc;
  }

  .rr-branch-card h2 {
    color: #0f172a;
    margin: 0 0 8px;
    font-size: 20px;
  }

  .rr-branch-card p {
    margin: 0 0 10px;
    color: #334155;
  }

  .rr-risk-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 14px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 13px;
    color: #fff;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .rr-risk-high {
    background: #ef4444;
  }

  .rr-risk-medium {
    background: #f59e0b;
  }

  .rr-risk-low {
    background: #10b981;
  }

  .rr-risk-dimensions {
    margin: 18px 0;
    padding: 16px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .rr-risk-dimensions span {
    padding: 6px 10px;
    border-radius: 8px;
    background: #f1f5f9;
    font-size: 13px;
    display: inline-flex;
    gap: 6px;
    align-items: center;
  }

  .rr-risk-section {
    margin: 18px 0;
    padding: 16px 18px;
    background: #ffffff;
    border-left: 4px solid #2563eb;
    border-radius: 10px;
  }

  .rr-risk-section strong {
    display: block;
    font-size: 14px;
    color: #0f172a;
    margin-bottom: 6px;
  }

  .rr-risk-section p {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .rr-risk-section p:last-child {
    margin-bottom: 0;
  }

  .rr-mitigation {
    background: #ecfdf5;
    border-left: 4px solid #10b981;
    padding: 16px 18px;
    border-radius: 10px;
    margin-top: 18px;
  }

  .rr-mitigation strong {
    display: block;
    font-size: 14px;
    color: #065f46;
    margin-bottom: 8px;
  }

  .rr-mitigation ul {
    margin: 0;
    padding-left: 20px;
    font-size: 14px;
    color: #0f172a;
  }

  .rr-multiline {
    white-space: pre-line;
  }

  .rr-divider {
    margin: 48px 0 24px;
    border: none;
    border-top: 2px solid #e2e8f0;
  }

  .rr-footer {
    text-align: center;
    color: #64748b;
    font-size: 13px;
  }
`;

const DIMENSION_LABELS = {
  financial: '💰 Financial',
  technical: '⚙️ Technical',
  organizational: '👥 Organizational',
  ecosystem: '🌐 Ecosystem',
};

const DECISION_YEAR_FALLBACK = 2025;

const formatMitigationList = (mitigation) => {
  if (!Array.isArray(mitigation) || mitigation.length === 0) {
    return '<p class="rr-body-text">No mitigation strategies documented yet.</p>';
  }

  return `<ul>${mitigation.map((item) => `<li>${item}</li>`).join('')}</ul>`;
};

const renderRiskDimensions = (dimensions) => {
  if (!dimensions) {
    return '';
  }

  const entries = Object.entries(dimensions)
    .filter(([, value]) => value)
    .map(([key, value]) => `<span>${DIMENSION_LABELS[key] || key}: <strong>${value}</strong></span>`);

  if (entries.length === 0) {
    return '';
  }

  return `<div class="rr-risk-dimensions">
    <strong style="width: 100%; color: #0f172a; font-size: 14px;">Dimensional Risk Assessment</strong>
    ${entries.join('')}
  </div>`;
};

const renderRiskAnalyses = (analyses) => {
  if (!analyses) {
    return '';
  }

  const segments = Object.entries(analyses)
    .filter(([, value]) => value)
    .map(([key, value]) => `<p class="rr-multiline"><strong>${DIMENSION_LABELS[key] || key}:</strong><br>${value}</p>`);

  if (segments.length === 0) {
    return '';
  }

  return `<div class="rr-risk-section">
    <strong>Detailed Risk Breakdown</strong>
    <div>
      ${segments.join('')}
    </div>
  </div>`;
};

const renderBranchCard = (branch, index) => {
  const riskLevel = branch?.riskLevel || 'MEDIUM';
  const badgeClass = RISK_LEVEL_STYLES[riskLevel] || RISK_LEVEL_STYLES.MEDIUM;

  return `<section class="rr-branch-card">
    <h2>Branch ${index + 1}: ${branch?.name || 'Unnamed Branch'}</h2>
    ${branch?.description ? `<p class="rr-multiline"><em>${branch.description}</em></p>` : ''}
    <div style="margin: 12px 0 6px;">
      <strong>Overall Risk Level:</strong>
      <span class="rr-risk-badge ${badgeClass}">${riskLevel}</span>
    </div>
    ${renderRiskDimensions(branch?.riskDimensions)}
    <div class="rr-risk-section">
      <strong>Strategic Assessment</strong>
      <p class="rr-multiline">${branch?.reasoning || 'Risk analysis in progress...'}</p>
    </div>
    ${renderRiskAnalyses(branch?.riskAnalyses)}
    <div class="rr-mitigation">
      <strong>Mitigation Strategies</strong>
      ${formatMitigationList(branch?.mitigation)}
    </div>
  </section>`;
};

const buildReportBody = (data = {}) => {
  const { context = '', branches = [], decisionYear } = data;
  const decisionYearValue = decisionYear ?? DECISION_YEAR_FALLBACK;

  const contextSection = context
    ? `<section class="rr-context">
        <h2 class="rr-section-heading" style="margin-top: 0;">Context Overview</h2>
        <p class="rr-body-text rr-multiline">${context}</p>
      </section>`
    : '';

  const branchCards = branches.length > 0
    ? branches.map((branch, index) => renderBranchCard(branch, index)).join('')
    : '<p class="rr-body-text">No branch analyses are available yet.</p>';

  return `<div class="rr-report-root">
    <header>
      <h1 class="rr-title">Roadmap Risk Analysis Report</h1>
      <p class="rr-timestamp">Generated: ${new Date().toLocaleString()}</p>
      <p class="rr-timestamp">Decision Year: ${decisionYearValue}</p>
    </header>
    ${contextSection}
    <section>
      <h2 class="rr-section-heading">Executive Summary</h2>
      <p class="rr-body-text">
        This report analyzes the risk profile of ${branches.length} decision ${branches.length === 1 ? 'branch' : 'branches'} for the product roadmap.
        Each branch has been evaluated across four risk dimensions: Financial, Technical, Organizational, and Ecosystem (partner and market exposure).
      </p>
    </section>
    ${branchCards}
    <hr class="rr-divider" />
    <footer>
      <p class="rr-footer">Report generated by Roadmap Rationalizer</p>
    </footer>
  </div>`;
};

/**
 * Exports the analysis as an HTML report
 * @param {Object} data - Analysis data
 * @returns {string} - HTML string
 */
export function exportHTMLReport(data) {
  const reportBody = buildReportBody(data);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Roadmap Risk Analysis Report</title>
  <style>${REPORT_STYLES}</style>
</head>
<body>
${reportBody}
</body>
</html>`;
}

/**
 * Exports the analysis as a PDF document using the HTML report structure
 * @param {Object} data - Analysis data
 */
export async function exportPDFReport(data) {
  if (typeof window === 'undefined') {
    throw new Error('PDF export is only available in a browser environment.');
  }

  const reportBody = buildReportBody(data);
  const container = document.createElement('div');
  container.className = 'rr-pdf-export-container';
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '-10000px';
  container.style.width = '900px';
  container.style.padding = '32px 40px';
  container.style.backgroundColor = '#ffffff';
  container.style.zIndex = '-1';
  container.style.opacity = '0';
  container.style.pointerEvents = 'none';
  container.innerHTML = `<style>${REPORT_STYLES}</style>${reportBody}`;

  document.body.appendChild(container);

  if (!window.html2canvas) {
    window.html2canvas = html2canvas;
  }

  try {
    const doc = new jsPDF('p', 'pt', 'a4');
    const marginX = 36;
    const marginY = 36;
    const availableWidth = doc.internal.pageSize.getWidth() - marginX * 2;

    await doc.html(container, {
      x: marginX,
      y: marginY,
      width: availableWidth,
      windowWidth: 900,
      autoPaging: 'text',
      html2canvas: {
        scale: 0.82,
        useCORS: true,
        backgroundColor: '#ffffff',
      },
    });

    doc.save('roadmap-risk-analysis.pdf');
  } finally {
    document.body.removeChild(container);
  }
}
