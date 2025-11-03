import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const SEVERITY_RANK = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
};

const GOLD_BASE = '#D4AF37';
const GOLD_HI = '#F2D48F';
const GOLD_LO = '#9D7A1F';
const EMERALD_DARK = '#0B3D34';
const EMERALD_MID = '#1A8A74';
const EMERALD_LIGHT = '#43A089';
const SUCCESS_MINT = '#25B78A';
const TEXT_FOG = '#EAF2F1';
const TEXT_SEAFOAM = '#C7E0DA';

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
    border: GOLD_BASE,
    selectedBg: 'rgba(212,175,55,0.22)',
    headerGradient: 'bg-[radial-gradient(120%_120%_at_0%_0%,rgba(212,175,55,0.3),rgba(7,27,23,0.85))]',
    titleClass: 'text-gold-base',
  },
  technical: {
    border: EMERALD_LIGHT,
    selectedBg: 'rgba(67,160,137,0.24)',
    headerGradient: 'bg-[radial-gradient(120%_120%_at_0%_0%,rgba(67,160,137,0.28),rgba(7,27,23,0.85))]',
    titleClass: 'text-emerald-400',
  },
  organizational: {
    border: SUCCESS_MINT,
    selectedBg: 'rgba(37,183,138,0.22)',
    headerGradient: 'bg-[radial-gradient(120%_120%_at_0%_0%,rgba(37,183,138,0.28),rgba(7,27,23,0.85))]',
    titleClass: 'text-success',
  },
  ecosystem: {
    border: GOLD_LO,
    selectedBg: 'rgba(157,122,31,0.26)',
    headerGradient: 'bg-[radial-gradient(120%_120%_at_0%_0%,rgba(157,122,31,0.32),rgba(7,27,23,0.85))]',
    titleClass: 'text-gold-base',
  },
};

const getRiskColor = (level) => {
  switch (level?.toUpperCase()) {
    case 'HIGH':
      return {
        bg: 'rgba(190,70,70,0.3)',
        border: '#C03A3A',
        text: '#F7E2E2',
        badgeBg: '#D95454',
        badgeBorder: '#A53030',
        badgeText: '#1A1A1A',
      };
    case 'MEDIUM':
      return {
        bg: 'rgba(212,175,55,0.26)',
        border: GOLD_BASE,
        text: TEXT_FOG,
        badgeBg: GOLD_BASE,
        badgeBorder: GOLD_LO,
        badgeText: '#1A1A1A',
      };
    case 'LOW':
      return {
        bg: 'rgba(37,183,138,0.3)',
        border: SUCCESS_MINT,
        text: TEXT_FOG,
        badgeBg: SUCCESS_MINT,
        badgeBorder: '#177C5F',
        badgeText: TEXT_FOG,
      };
    default:
      return {
        bg: 'rgba(67,160,137,0.28)',
        border: EMERALD_MID,
        text: TEXT_FOG,
        badgeBg: EMERALD_LIGHT,
        badgeBorder: EMERALD_MID,
        badgeText: TEXT_FOG,
      };
  }
};

function RiskDetailsPanel({ selectedRisk, onExpand }) {
  const levelColors = selectedRisk ? getRiskColor(selectedRisk.level) : null;
  return (
    <aside className="w-96 flex-shrink-0 border-l border-[rgba(19,68,59,0.55)] bg-[rgba(7,27,23,0.7)] sticky top-[6rem] text-fog">
      <div className="h-[calc(100vh-6rem)] flex flex-col px-6 py-6">
        {selectedRisk ? (
          <div className="flex flex-col h-full bg-[rgba(7,27,23,0.6)] rounded-3xl overflow-hidden border border-[rgba(19,68,59,0.55)] shadow-satin">
            <div
              className={`p-6 border-b border-[rgba(19,68,59,0.55)] ${
                RISK_TYPE_STYLES[selectedRisk.riskType]?.headerGradient ||
                'bg-[radial-gradient(120%_120%_at_0%_0%,rgba(67,160,137,0.25),rgba(7,27,23,0.75))]'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-seafoam" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-seafoam font-semibold uppercase tracking-[0.2em]">
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
                        'text-fog'
                      }`}
                    >
                      {selectedRisk.label}
                    </h3>
                    <p className="text-xs text-seafoam mt-0.5">{selectedRisk.sublabel}</p>
                  </div>
                </div>
                {levelColors && (
                  <div
                    className="px-3 py-1.5 rounded-lg border-2 font-bold text-xs tracking-[0.18em] uppercase flex items-center justify-center"
                    style={{
                      background: levelColors.badgeBg,
                      borderColor: levelColors.badgeBorder,
                      color: levelColors.badgeText,
                    }}
                  >
                    {selectedRisk.level}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-invert prose-sm max-w-none text-seafoam leading-relaxed">
                <ReactMarkdown>
                  {typeof selectedRisk.content === 'string' && selectedRisk.content
                    ? selectedRisk.content
                    : 'Analysis in progress...'}
                </ReactMarkdown>
              </div>
            </div>

            <div className="p-4 border-t border-[rgba(19,68,59,0.55)] bg-[rgba(7,27,23,0.75)]">
              <button
                onClick={() => onExpand(selectedRisk)}
                className="w-full btn-emerald text-sm"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Expand Full View
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center bg-[rgba(7,27,23,0.55)] border border-dashed border-[rgba(67,160,137,0.45)] rounded-3xl p-10 h-full">
            <div className="w-20 h-20 bg-[rgba(7,27,23,0.7)] border border-[rgba(67,160,137,0.45)] rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gold-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-fog mb-2">
              Select a Risk Node
            </h3>
            <p className="text-sm text-seafoam max-w-xs">
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
    startY: 220,
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
  const svgHeight = totalHeight + 260;

  return (
    <div className="relative card-elevated">
      <div className="flex items-start">
        {/* Left side - Tree Diagram */}
        <div className="flex-1 p-12 overflow-x-auto border-r border-[rgba(19,68,59,0.55)]">
          <div className="relative" style={{ minWidth: svgWidth + 160 }}>
            <svg width={svgWidth} height={svgHeight} className="overflow-visible">
              {/* Define arrow marker for paths */}
              <defs>
                <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="160%" colorInterpolationFilters="sRGB">
                  <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="rgba(0,0,0,0.45)" />
                </filter>
                <filter id="riskShadow" x="-20%" y="-20%" width="140%" height="160%" colorInterpolationFilters="sRGB">
                  <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(0,0,0,0.35)" />
                </filter>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  fill="rgba(212,175,55,0.55)"
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
                    stroke="rgba(212,175,55,0.35)"
                    strokeWidth="2.4"
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
                      strokeWidth="2.5"
                      filter="url(#nodeShadow)"
                      strokeLinejoin="round"
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
                      fill={isSelected ? theme.selectedBg : 'rgba(11,61,52,0.82)'}
                      stroke={isSelected ? GOLD_HI : GOLD_BASE}
                      strokeWidth={isSelected ? '3' : '2.2'}
                      filter="url(#riskShadow)"
                      className="transition-all hover:brightness-110"
                    />
                    <text
                      x={config.riskNodeWidth / 2}
                      y={20}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="18"
                      fill={TEXT_FOG}
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
                      fill={theme.border || TEXT_FOG}
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
                      fill={TEXT_SEAFOAM}
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
                      fill={levelColors.badgeBg}
                      stroke={levelColors.badgeBorder}
                      strokeWidth="1"
                    />
                    <text
                      x={config.riskNodeWidth / 2}
                      y={62}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="8"
                      fontWeight="700"
                      fill={levelColors.badgeText}
                    >
                      {node.level}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="mt-8 bg-[rgba(7,27,23,0.6)] rounded-2xl p-6 border border-[rgba(19,68,59,0.55)]">
            <h3 className="font-bold text-fog mb-4 uppercase tracking-[0.2em] text-sm flex items-center gap-2">
              <svg className="w-4 h-4 text-gold-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Legend
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3 text-seafoam">
              <div className="flex items-center gap-3 bg-[rgba(7,27,23,0.55)] p-3 rounded-xl border border-[rgba(19,68,59,0.55)]">
                <div className="w-8 h-8 border-2 border-[rgba(242,212,143,0.55)] rounded-lg bg-[rgba(11,61,52,0.85)]"></div>
                <span className="font-medium">Decision Branch</span>
              </div>
              <div className="flex items-center gap-3 bg-[rgba(7,27,23,0.55)] p-3 rounded-xl border border-[rgba(19,68,59,0.55)]">
                <div className="w-8 h-8 border-2 border-[rgba(242,212,143,0.55)] rounded-lg bg-[rgba(11,61,52,0.75)]"></div>
                <span className="font-medium">Risk Node (click to view)</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-seafoam">
              {['HIGH', 'MEDIUM', 'LOW'].map((level) => {
                const palette = getRiskColor(level);
                return (
                  <div key={level} className="flex items-center gap-3 bg-[rgba(7,27,23,0.55)] p-3 rounded-xl border border-[rgba(19,68,59,0.55)]">
                    <div
                      className="w-8 h-8 rounded-lg border-2"
                      style={{ background: palette.bg, borderColor: palette.border }}
                    ></div>
                    <span className="font-medium capitalize">{level.toLowerCase()} Risk</span>
              </div>
                );
              })}
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
            className="bg-[rgba(7,27,23,0.9)] border border-[rgba(19,68,59,0.55)] rounded-3xl shadow-satin max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={`flex items-center justify-between p-8 border-b border-[rgba(19,68,59,0.55)] ${
                (RISK_TYPE_STYLES[selectedModal.riskType]?.headerGradient) ||
                'bg-[radial-gradient(120%_120%_at_0%_0%,rgba(67,160,137,0.25),rgba(7,27,23,0.75))]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl branch-depth bg-[linear-gradient(145deg,#1A8A74,#0F6B5C)]">
                  {selectedModal.icon}
                </div>
                <div>
                  <h3
                    className={`text-2xl font-bold font-display mb-1 ${
                      RISK_TYPE_STYLES[selectedModal.riskType]?.titleClass || 'text-fog'
                    }`}
                  >
                    {selectedModal.label}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-seafoam">
                    <svg className="w-4 h-4 text-gold-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Branch: {selectedModal.branch.name}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-seafoam hover:text-fog transition-colors p-2.5 hover:bg-[rgba(11,61,52,0.65)] rounded-xl"
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
            <div className="p-8 overflow-y-auto flex-1 bg-[rgba(7,27,23,0.6)]">
              <div className="prose prose-invert prose-sm max-w-none bg-[rgba(7,27,23,0.75)] rounded-2xl p-6 border border-[rgba(19,68,59,0.55)]">
                <ReactMarkdown>
                  {typeof selectedModal.content === 'string' && selectedModal.content
                    ? selectedModal.content
                    : 'Analysis in progress...'}
                </ReactMarkdown>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[rgba(19,68,59,0.55)] bg-[rgba(7,27,23,0.8)] flex justify-end">
              <button
                onClick={closeModal}
                className="btn-gold"
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

