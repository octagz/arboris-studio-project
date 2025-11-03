import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const SEVERITY_RANK = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
};

const normalizeLevel = (value) => {
  if (!value || typeof value !== 'string') return null;
  const normalized = value.trim().toUpperCase();
  return ['LOW', 'MEDIUM', 'HIGH'].includes(normalized) ? normalized : null;
};

const parseSeverity = (text) => {
  if (!text || typeof text !== 'string') return null;

  const ratingMatch = text.match(/severity\s*(rating)?\s*:?\s*(HIGH|MEDIUM|LOW)/i);
  if (ratingMatch) {
    return ratingMatch[2].toUpperCase();
  }

  const fallbackMatch = text.match(/\b(HIGH|MEDIUM|LOW)\b\s+severity/i);
  if (fallbackMatch) {
    return fallbackMatch[1].toUpperCase();
  }

  return null;
};

const pickSeverity = (...levels) => {
  let best = null;

  levels.forEach((level) => {
    const normalized = normalizeLevel(level);
    if (!normalized) return;

    if (!best || SEVERITY_RANK[normalized] > SEVERITY_RANK[best]) {
      best = normalized;
    }
  });

  return best;
};

const RISK_TYPE_STYLES = {
  financial: {
    border: '#10b981',
    selectedBg: '#d1fae5',
    headerGradient: 'bg-gradient-to-r from-emerald-50 to-emerald-100',
    titleClass: 'text-emerald-900',
  },
  technical: {
    border: '#3b82f6',
    selectedBg: '#dbeafe',
    headerGradient: 'bg-gradient-to-r from-blue-50 to-blue-100',
    titleClass: 'text-blue-900',
  },
  organizational: {
    border: '#8b5cf6',
    selectedBg: '#ede9fe',
    headerGradient: 'bg-gradient-to-r from-purple-50 to-purple-100',
    titleClass: 'text-purple-900',
  },
  ecosystem: {
    border: '#f97316',
    selectedBg: '#ffedd5',
    headerGradient: 'bg-gradient-to-r from-amber-50 to-amber-100',
    titleClass: 'text-amber-900',
  },
};

function RiskDetailsPanel({ selectedRisk, onExpand }) {
  return (
    <aside className="w-96 flex-shrink-0 border-l border-neutral-200 bg-neutral-50 sticky top-[6rem]">
      <div className="h-[calc(100vh-6rem)] flex flex-col px-6 py-6">
        {selectedRisk ? (
          <div className="flex flex-col h-full bg-neutral-50 rounded-3xl overflow-hidden border border-neutral-200 shadow-sm">
            <div
              className={`p-6 border-b border-neutral-200 ${
                RISK_TYPE_STYLES[selectedRisk.riskType]?.headerGradient ||
                'bg-gradient-to-r from-neutral-50 to-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-neutral-600 font-semibold uppercase tracking-wide">
                  {selectedRisk.branch.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">
                    {selectedRisk.icon}
                  </div>
                  <div>
                    <h3
                      className={`font-bold text-lg uppercase tracking-wide ${
                        RISK_TYPE_STYLES[selectedRisk.riskType]?.titleClass ||
                        'text-neutral-900'
                      }`}
                    >
                      {selectedRisk.label}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-0.5">{selectedRisk.sublabel}</p>
                  </div>
                </div>
                {selectedRisk.level && (
                  <div className={`px-3 py-1.5 rounded-lg border-2 font-bold text-xs ${
                    selectedRisk.level === 'HIGH'
                      ? 'bg-red-100 border-red-600 text-red-900'
                      : selectedRisk.level === 'MEDIUM'
                      ? 'bg-amber-100 border-amber-600 text-amber-900'
                      : 'bg-emerald-100 border-emerald-600 text-emerald-900'
                  }`}>
                    {selectedRisk.level}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-sm max-w-none text-neutral-700 leading-relaxed">
                <ReactMarkdown>
                  {typeof selectedRisk.content === 'string' && selectedRisk.content
                    ? selectedRisk.content
                    : 'Analysis in progress...'}
                </ReactMarkdown>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-200 bg-white">
              <button
                onClick={() => onExpand(selectedRisk)}
                className="w-full btn-secondary text-sm py-2"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Expand Full View
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center bg-white border border-dashed border-neutral-300 rounded-3xl p-10 h-full">
            <div className="w-20 h-20 bg-neutral-200 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Select a Risk Node
            </h3>
            <p className="text-sm text-neutral-600 max-w-xs">
              Click on any risk node in the diagram to view detailed analysis here.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default function TreeDiagram({ branches, context }) {
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [selectedModal, setSelectedModal] = useState(null);

  if (!branches || branches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No branches to display yet. Upload files to start analysis.</p>
      </div>
    );
  }

  // Layout configuration - adjusted to start from left
  const config = {
    nodeWidth: 220,
    nodeHeight: 100, // Increased to accommodate multi-line text
    riskNodeWidth: 160,
    riskNodeHeight: 70,
    horizontalGap: 260,
    verticalGap: 540, // Expanded to prevent overlap between branches with four risk nodes
    startX: 50,
    startY: 120,
  };

  const dimensionSpacing = 140; // Vertical spacing between risk nodes for a single branch

  const totalHeight = Math.max(branches.length * config.verticalGap, 400);

  // Create decision nodes (starting from left, one per branch)
  const decisionNodes = branches.map((branch, index) => ({
    x: config.startX,
    y: config.startY + index * config.verticalGap,
    label: branch.name,
    branch: branch,
    type: 'decision',
    index: index,
  }));

  // Create risk nodes - now showing four strategic dimensions
  const riskNodes = [];
  branches.forEach((branch, branchIndex) => {
    const decisionNode = decisionNodes[branchIndex];
    const financialAnalysis = branch.riskAnalyses?.financial;
    const technicalAnalysis = branch.riskAnalyses?.technical;
    const organizationalAnalysis = branch.riskAnalyses?.organizational;
    const ecosystemAnalysis = branch.riskAnalyses?.ecosystem;

    const fallbackLevel = normalizeLevel(branch.riskLevel) || 'MEDIUM';

    const financialLevel =
      normalizeLevel(branch.riskDimensions?.financial) ||
      normalizeLevel(branch.riskSeverities?.financial) ||
      parseSeverity(financialAnalysis) ||
      fallbackLevel;

    const technicalLevel =
      normalizeLevel(branch.riskDimensions?.technical) ||
      normalizeLevel(branch.riskSeverities?.technical) ||
      parseSeverity(technicalAnalysis) ||
      fallbackLevel;

    const organizationalLevel =
      normalizeLevel(branch.riskDimensions?.organizational) ||
      normalizeLevel(branch.riskSeverities?.organizational) ||
      parseSeverity(organizationalAnalysis) ||
      fallbackLevel;

    const ecosystemLevel =
      normalizeLevel(branch.riskDimensions?.ecosystem) ||
      normalizeLevel(branch.riskSeverities?.ecosystem) ||
      parseSeverity(ecosystemAnalysis) ||
      fallbackLevel;

    const dimensions = [
      {
        type: 'financial',
        icon: '💰',
        label: 'Financial',
        sublabel: 'Capital & ROI',
        level: financialLevel,
        content: financialAnalysis,
      },
      {
        type: 'technical',
        icon: '⚙️',
        label: 'Technical',
        sublabel: 'Engineering Scope',
        level: technicalLevel,
        content: technicalAnalysis,
      },
      {
        type: 'organizational',
        icon: '👥',
        label: 'Organizational',
        sublabel: 'People & Process',
        level: organizationalLevel,
        content: organizationalAnalysis,
      },
      {
        type: 'ecosystem',
        icon: '🌐',
        label: 'Ecosystem',
        sublabel: 'Partners & Market',
        level: ecosystemLevel,
        content: ecosystemAnalysis,
      },
    ];

    dimensions.forEach((dimension, dimIndex) => {
      const yOffset = (dimIndex - (dimensions.length - 1) / 2) * dimensionSpacing;
      riskNodes.push({
        x: decisionNode.x + config.nodeWidth + config.horizontalGap,
        y: decisionNode.y + yOffset,
        label: dimension.label,
        sublabel: dimension.sublabel,
        icon: dimension.icon,
        type: 'dimension',
        riskType: dimension.type,
        level: dimension.level,
        branch: branch,
        content: dimension.content,
      });
    });
  });

  // Generate curved paths between nodes
  const generatePath = (x1, y1, x2, y2) => {
    const midX = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
  };

  // Get color for risk level
  const getRiskColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'HIGH':
        return { bg: '#fee2e2', border: '#dc2626', text: '#991b1b' };
      case 'MEDIUM':
        return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' };
      case 'LOW':
        return { bg: '#d1fae5', border: '#10b981', text: '#065f46' };
      default:
        return { bg: '#f3f4f6', border: '#9ca3af', text: '#4b5563' };
    }
  };

  const handleRiskClick = (risk) => {
    setSelectedRisk(risk);
  };

  const handleModalClick = (risk) => {
    setSelectedModal(risk);
  };

  const closeModal = () => {
    setSelectedModal(null);
  };

  // Helper function to wrap text into multiple lines
  const wrapText = (text, maxCharsPerLine) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (testLine.length <= maxCharsPerLine) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const svgWidth = config.startX + config.nodeWidth + config.horizontalGap + config.riskNodeWidth + 50;
  const svgHeight = totalHeight + 200;

  return (
    <div className="relative card-elevated">
      <div className="flex items-start">
        {/* Left side - Tree Diagram */}
        <div className="flex-1 p-8 overflow-x-auto border-r border-neutral-200">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h2 className="section-title">
                Decision Tree Visualization
              </h2>
            </div>
            <p className="text-neutral-600 text-sm leading-relaxed ml-13">
              Click any risk node to view detailed analysis in the side panel.
            </p>
          </div>

          <div className="relative" style={{ minWidth: svgWidth }}>
            <svg width={svgWidth} height={svgHeight} className="overflow-visible">
              {/* Define arrow marker for paths */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  fill="#9ca3af"
                >
                  <polygon points="0 0, 10 3, 0 6" />
                </marker>
              </defs>

              {/* Draw connections from decision nodes to risk nodes */}
              {riskNodes.map((riskNode, index) => {
                const decisionNode = decisionNodes.find(
                  (dn) => dn.branch === riskNode.branch
                );
                return (
                  <path
                    key={`path-risk-${index}`}
                    d={generatePath(
                      decisionNode.x + config.nodeWidth,
                      decisionNode.y + config.nodeHeight / 2,
                      riskNode.x,
                      riskNode.y + config.riskNodeHeight / 2
                    )}
                    stroke="#9ca3af"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                    opacity="0.4"
                  />
                );
              })}

              {/* Decision Nodes */}
              {decisionNodes.map((node, index) => {
                const colors = getRiskColor(node.branch.riskLevel);
                const wrappedText = wrapText(node.label, 24); // Max ~24 chars per line for 220px width
                const lineHeight = 16;
                const totalTextHeight = wrappedText.length * lineHeight;
                const startY = (config.nodeHeight - totalTextHeight - 25) / 2; // Account for risk level badge
                
                return (
                  <g
                    key={`decision-${index}`}
                    transform={`translate(${node.x}, ${node.y})`}
                  >
                    <rect
                      width={config.nodeWidth}
                      height={config.nodeHeight}
                      rx="8"
                      fill={colors.bg}
                      stroke={colors.border}
                      strokeWidth="2"
                    />
                    {/* Multi-line text */}
                    {wrappedText.map((line, lineIndex) => (
                      <text
                        key={lineIndex}
                        x={config.nodeWidth / 2}
                        y={startY + 20 + (lineIndex * lineHeight)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={colors.text}
                        fontSize="13"
                        fontWeight="600"
                      >
                        {line}
                      </text>
                    ))}
                    {/* Risk level badge */}
                    <text
                      x={config.nodeWidth / 2}
                      y={config.nodeHeight - 20}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={colors.text}
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {node.branch.riskLevel || 'Analyzing...'}
                    </text>
                  </g>
                );
              })}

              {/* Dimension Risk Nodes */}
              {riskNodes.map((node, index) => {
                const isSelected =
                  selectedRisk &&
                  selectedRisk.riskType === node.riskType &&
                  selectedRisk.branch.name === node.branch.name;

                const levelColors = getRiskColor(node.level);
                const theme = RISK_TYPE_STYLES[node.riskType] || {
                  border: '#9ca3af',
                  selectedBg: '#e5e7eb',
                };

                return (
                  <g
                    key={`risk-${index}`}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => handleRiskClick(node)}
                    onDoubleClick={() => handleModalClick(node)}
                    className="cursor-pointer"
                  >
                    <rect
                      width={config.riskNodeWidth}
                      height={config.riskNodeHeight + 10}
                      rx="6"
                      fill={isSelected ? theme.selectedBg : '#ffffff'}
                      stroke={theme.border}
                      strokeWidth={isSelected ? '3' : '2'}
                      className="transition-all hover:opacity-80"
                    />
                    <text
                      x={config.riskNodeWidth / 2}
                      y={20}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="18"
                    >
                      {node.icon}
                    </text>
                    <text
                      x={config.riskNodeWidth / 2}
                      y={38}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="#1f2937"
                    >
                      {node.label}
                    </text>
                    <text
                      x={config.riskNodeWidth / 2}
                      y={50}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="9"
                      fontWeight="400"
                      fill="#6b7280"
                    >
                      {node.sublabel}
                    </text>
                    {/* Risk Level Badge */}
                    <rect
                      x={config.riskNodeWidth / 2 - 20}
                      y={56}
                      width={40}
                      height={12}
                      rx="6"
                      fill={levelColors.bg}
                      stroke={levelColors.border}
                      strokeWidth="1"
                    />
                    <text
                      x={config.riskNodeWidth / 2}
                      y={62}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="8"
                      fontWeight="700"
                      fill={levelColors.text}
                    >
                      {node.level}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="mt-8 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-6 border border-neutral-200">
            <h3 className="font-bold text-neutral-900 mb-4 uppercase tracking-wide text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Legend
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-neutral-200">
                <div className="w-8 h-8 border-2 border-neutral-400 rounded-lg bg-neutral-50"></div>
                <span className="font-medium text-neutral-700">Decision Branch</span>
              </div>
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-neutral-200">
                <div className="w-8 h-8 border-2 border-primary-500 rounded-lg bg-white"></div>
                <span className="font-medium text-neutral-700">Risk Node (click to view)</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-neutral-200">
                <div className="w-8 h-8 bg-red-100 border-2 border-red-600 rounded-lg"></div>
                <span className="font-medium text-neutral-700">High Risk</span>
              </div>
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-neutral-200">
                <div className="w-8 h-8 bg-amber-100 border-2 border-amber-600 rounded-lg"></div>
                <span className="font-medium text-neutral-700">Medium Risk</span>
              </div>
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-neutral-200">
                <div className="w-8 h-8 bg-emerald-100 border-2 border-emerald-600 rounded-lg"></div>
                <span className="font-medium text-neutral-700">Low Risk</span>
              </div>
            </div>
          </div>
        </div>

        <RiskDetailsPanel selectedRisk={selectedRisk} onExpand={handleModalClick} />
      </div>

      {/* Modal for Full View */}
      {selectedModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl shadow-soft-lg max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={`flex items-center justify-between p-8 border-b border-neutral-200 ${
                (RISK_TYPE_STYLES[selectedModal.riskType]?.headerGradient) ||
                'bg-gradient-to-r from-neutral-50 to-neutral-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center text-4xl shadow-soft">
                  {selectedModal.icon}
                </div>
                <div>
                  <h3
                    className={`text-2xl font-bold font-display mb-1 ${
                      RISK_TYPE_STYLES[selectedModal.riskType]?.titleClass || 'text-neutral-900'
                    }`}
                  >
                    {selectedModal.label}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Branch: {selectedModal.branch.name}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-neutral-400 hover:text-neutral-700 transition-colors p-2.5 hover:bg-neutral-100 rounded-xl"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto flex-1 bg-neutral-50">
              <div className="prose prose-sm max-w-none bg-white rounded-2xl p-6 border border-neutral-200">
                <ReactMarkdown>
                  {typeof selectedModal.content === 'string' && selectedModal.content
                    ? selectedModal.content
                    : 'Analysis in progress...'}
                </ReactMarkdown>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-neutral-200 bg-white flex justify-end">
              <button
                onClick={closeModal}
                className="btn-primary"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

