import jsPDF from 'jspdf';

/**
 * Exports the analysis as an HTML report
 * @param {Object} data - Analysis data
 * @returns {string} - HTML string
 */
export function exportHTMLReport(data) {
  const { context, branches, analysis, decisionYear } = data;
  const decisionYearValue = decisionYear ?? 2025;

  const riskColor = {
    HIGH: '#ef4444',
    MEDIUM: '#f59e0b',
    LOW: '#10b981',
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Roadmap Risk Analysis Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1 {
      color: #1f2937;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 10px;
    }
    h2 {
      color: #374151;
      margin-top: 30px;
    }
    .branch-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      background: #f9fafb;
    }
    .risk-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: bold;
      font-size: 14px;
      color: white;
    }
    .risk-high { background: ${riskColor.HIGH}; }
    .risk-medium { background: ${riskColor.MEDIUM}; }
    .risk-low { background: ${riskColor.LOW}; }
    .risk-section {
      margin: 15px 0;
      padding: 10px;
      background: white;
      border-left: 4px solid #3b82f6;
    }
    .mitigation {
      background: #ecfdf5;
      border-left: 4px solid #10b981;
      padding: 10px;
      margin: 10px 0;
    }
    .mitigation ul {
      margin: 5px 0;
      padding-left: 20px;
    }
    .timestamp {
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <h1>Roadmap Risk Analysis Report</h1>
  <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
  <p class="timestamp">Decision Year: ${decisionYearValue}</p>

  <h2>Executive Summary</h2>
  <p>This report analyzes the risk profile of ${branches.length} decision branches for the product roadmap. Each branch has been evaluated across four risk dimensions: Financial, Technical, Organizational, and Ecosystem (partner and market exposure).</p>

  ${branches.map((branch, index) => `
    <div class="branch-card">
      <h2>Branch ${index + 1}: ${branch.name}</h2>
      <p><em>${branch.description}</em></p>
      
      <div>
        <strong>Overall Risk Level: </strong>
        <span class="risk-badge risk-${branch.riskLevel?.toLowerCase()}">
          ${branch.riskLevel || 'MEDIUM'}
        </span>
      </div>

      ${branch.riskDimensions ? `
      <div style="margin: 15px 0; padding: 15px; background: white; border: 1px solid #e5e7eb; border-radius: 6px;">
        <strong>Dimensional Risk Assessment:</strong>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
          <span style="padding: 4px 8px; border-radius: 4px; background: #f3f4f6; font-size: 13px;">
            💰 Financial: <strong>${branch.riskDimensions.financial}</strong>
          </span>
          <span style="padding: 4px 8px; border-radius: 4px; background: #f3f4f6; font-size: 13px;">
            ⚙️ Technical: <strong>${branch.riskDimensions.technical}</strong>
          </span>
          <span style="padding: 4px 8px; border-radius: 4px; background: #f3f4f6; font-size: 13px;">
            👥 Organizational: <strong>${branch.riskDimensions.organizational}</strong>
          </span>
          <span style="padding: 4px 8px; border-radius: 4px; background: #f3f4f6; font-size: 13px;">
            🌐 Ecosystem: <strong>${branch.riskDimensions.ecosystem}</strong>
          </span>
        </div>
      </div>
      ` : ''}

      <div class="risk-section">
        <strong>Strategic Assessment:</strong>
        <p>${branch.reasoning || 'Risk analysis in progress...'}</p>
      </div>

      <div class="risk-section">
        <strong>Detailed Risk Breakdown:</strong>
        <div style="margin-left: 20px;">
          <p><strong>Financial:</strong><br>${branch.riskAnalyses?.financial || 'Analysis pending...'}</p>
          <p><strong>Technical:</strong><br>${branch.riskAnalyses?.technical || 'Analysis pending...'}</p>
          <p><strong>Organizational:</strong><br>${branch.riskAnalyses?.organizational || 'Analysis pending...'}</p>
          <p><strong>Ecosystem:</strong><br>${branch.riskAnalyses?.ecosystem || 'Analysis pending...'}</p>
        </div>
      </div>

      <div class="mitigation">
        <strong>Mitigation Strategies:</strong>
        <ul>
          ${(branch.mitigation || []).map(m => `<li>${m}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('')}

  <hr style="margin: 40px 0; border: none; border-top: 2px solid #e5e7eb;">
  <p style="text-align: center; color: #6b7280; font-size: 14px;">
    Report generated by Roadmap Rationalizer
  </p>
</body>
</html>
  `;
}

/**
 * Exports the analysis as a PDF
 * @param {Object} data - Analysis data
 */
export function exportPDFReport(data) {
  const { context, branches, decisionYear } = data;
  const decisionYearValue = decisionYear ?? 2025;
  const doc = new jsPDF();
  
  const riskColor = {
    HIGH: [239, 68, 68],
    MEDIUM: [245, 158, 11],
    LOW: [16, 185, 129],
  };

  let yPosition = 20;

  // Title
  doc.setFontSize(20);
  doc.text('Roadmap Risk Analysis Report', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(11);
  doc.setTextColor(107, 114, 128);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Decision Year: ${decisionYearValue}`, 20, yPosition);
  yPosition += 9;

  // Summary
  doc.setFontSize(14);
  doc.setTextColor(55, 65, 81);
  doc.text('Executive Summary', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(11);
  doc.setTextColor(51, 51, 51);
  doc.text(
    `This report analyzes the risk profile of ${branches.length} decision branches for the product roadmap. Each branch has been evaluated across four dimensions: Financial, Technical, Organizational, and Ecosystem risk.`,
    20, yPosition, { maxWidth: 170 }
  );
  yPosition += 20;

  // Branches
  branches.forEach((branch, index) => {
    // Check if we need a new page
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }

    // Branch header
    doc.setFontSize(14);
    doc.setTextColor(55, 65, 81);
    doc.text(`Branch ${index + 1}: ${branch.name}`, 20, yPosition);
    yPosition += 8;

    // Description
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(branch.description, 20, yPosition, { maxWidth: 170 });
    yPosition += 10;

    // Risk level
    doc.setFontSize(11);
    doc.setTextColor(51, 51, 51);
    doc.text('Overall Risk Level: ', 20, yPosition);
    
    const riskLevel = branch.riskLevel || 'MEDIUM';
    doc.setTextColor(...riskColor[riskLevel]);
    doc.text(riskLevel, 70, yPosition);
    yPosition += 10;

    // Reasoning
    const reasoning = branch.reasoning || 'Risk analysis in progress...';
    const reasoningLines = doc.splitTextToSize(reasoning, 170);
    doc.setTextColor(51, 51, 51);
    doc.setFontSize(10);
    doc.text('Risk Reasoning:', 20, yPosition);
    yPosition += 6;
    doc.text(reasoningLines, 20, yPosition);
    yPosition += reasoningLines.length * 5 + 10;
  });

  doc.save('roadmap-risk-analysis.pdf');
}

