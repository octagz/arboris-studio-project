import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function RiskRadar({ branches, context }) {
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [hoveredRisk, setHoveredRisk] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  if (!branches || branches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No branches to display yet. Upload files to start analysis.</p>
      </div>
    );
  }

  // SVG dimensions
  const width = 1000;
  const height = 1000;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = 400;

  // Define risk level tiers (concentric circles)
  const tiers = [
    { level: 'LOW', radius: maxRadius, color: '#10b981', label: 'Low Risk' },
    { level: 'MEDIUM', radius: maxRadius * 0.65, color: '#f59e0b', label: 'Medium Risk' },
    { level: 'HIGH', radius: maxRadius * 0.35, color: '#ef4444', label: 'High Risk' },
  ];

  // Define categories matching the new hierarchical risk structure
  const categories = [
    { name: 'Financial Risk', angle: 0, color: '#10b981' },
    { name: 'Technical Risk', angle: 90, color: '#3b82f6' },
    { name: 'Organizational Risk', angle: 180, color: '#8b5cf6' },
    { name: 'Ecosystem Risk', angle: 270, color: '#f97316' },
  ];

  // Map branches to radar positions
  const risks = branches.map((branch, index) => {
    // Determine radius based on risk level
    let tier = tiers.find(t => t.level === branch.riskLevel) || tiers[1];
    
    // Distribute risks across categories
    const categoryIndex = index % categories.length;
    const category = categories[categoryIndex];
    
    // Add some variation to avoid exact overlap
    const angleVariation = (Math.random() - 0.5) * 30;
    const radiusVariation = (Math.random() - 0.5) * 40;
    
    const angle = category.angle + angleVariation;
    const radius = tier.radius + radiusVariation;
    
    return {
      id: index + 1,
      name: branch.name,
      branch: branch,
      angle: angle,
      radius: radius,
      riskLevel: branch.riskLevel,
      category: category.name,
    };
  });

  // Calculate position on radar
  const getPosition = (angle, radius) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(rad - Math.PI / 2),
      y: centerY + radius * Math.sin(rad - Math.PI / 2),
    };
  };

  // Get color for risk level
  const getRiskColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'HIGH':
        return '#ef4444';
      case 'MEDIUM':
        return '#f59e0b';
      case 'LOW':
        return '#10b981';
      default:
        return '#9ca3af';
    }
  };

  const handleRiskClick = (risk) => {
    setSelectedRisk(risk);
  };

  const handleMouseEnter = (risk, event) => {
    setHoveredRisk(risk);
    // Get the bounding box of the SVG to calculate absolute position
    const svg = event.currentTarget.ownerSVGElement;
    const rect = svg.getBoundingClientRect();
    const pos = getPosition(risk.angle, risk.radius);
    setTooltipPosition({
      x: rect.left + pos.x,
      y: rect.top + pos.y
    });
  };

  const handleMouseLeave = () => {
    setHoveredRisk(null);
  };

  const closeModal = () => {
    setSelectedRisk(null);
  };

  return (
    <>
      <div className="card-elevated p-8 relative">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="section-title">
              Risk Radar Visualization
            </h2>
          </div>
          <p className="text-neutral-600 text-sm leading-relaxed ml-13">
            Click any risk dot to view detailed analysis. Risks are positioned by severity (distance from center) and category (angular position).
          </p>
        </div>

        {/* Radar SVG */}
        <div className="flex justify-center">
          <svg width={width} height={height} className="overflow-visible" style={{ maxWidth: '100%', height: 'auto' }}>
            {/* Concentric circles for risk tiers */}
            {tiers.map((tier, idx) => (
              <g key={tier.level}>
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={tier.radius}
                  fill="none"
                  stroke={tier.color}
                  strokeWidth="2"
                  opacity="0.3"
                />
                {/* Tier label */}
                {idx < tiers.length && (
                  <text
                    x={centerX}
                    y={centerY - tier.radius - 10}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="600"
                    fill={tier.color}
                  >
                    {tier.label}
                  </text>
                )}
              </g>
            ))}

            {/* Category lines */}
            {categories.map((category) => {
              const endPos = getPosition(category.angle, maxRadius);
              const labelPos = getPosition(category.angle, maxRadius + 60);
              
              return (
                <g key={category.name}>
                  {/* Radial line */}
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={endPos.x}
                    y2={endPos.y}
                    stroke={category.color}
                    strokeWidth="2"
                    opacity="0.4"
                  />
                  {/* Category label */}
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="13"
                    fontWeight="700"
                    fill={category.color}
                  >
                    {category.name}
                  </text>
                </g>
              );
            })}

            {/* Risk dots - completely static, no animations */}
            {risks.map((risk) => {
              const pos = getPosition(risk.angle, risk.radius);
              
              return (
                <g key={risk.id}>
                  {/* Risk dot - absolutely no changes on hover */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={18}
                    fill={getRiskColor(risk.riskLevel)}
                    stroke="white"
                    strokeWidth={3}
                    onMouseEnter={(e) => handleMouseEnter(risk, e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleRiskClick(risk)}
                    style={{ cursor: 'pointer' }}
                  />
                  
                  {/* Risk number */}
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="11"
                    fontWeight="bold"
                    fill="white"
                    style={{ pointerEvents: 'none' }}
                  >
                    {risk.id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-8 flex items-center justify-center gap-8 text-sm">
          {tiers.reverse().map((tier) => (
            <div key={tier.level} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: tier.color }}
              />
              <span className="text-neutral-700 font-medium">{tier.label}</span>
            </div>
          ))}
        </div>

        {/* Floating tooltip - positioned absolutely outside SVG */}
        {hoveredRisk && !selectedRisk && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y - 60}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="bg-neutral-900 text-white px-4 py-2 rounded-lg shadow-lg max-w-xs">
              <p className="text-sm font-semibold text-center">
                {hoveredRisk.name}
              </p>
              <p className="text-xs text-neutral-300 text-center mt-1">
                {hoveredRisk.category}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Risk Details Modal */}
      {selectedRisk && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl shadow-soft-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="p-8 border-b border-neutral-200"
              style={{
                background: `linear-gradient(135deg, ${getRiskColor(selectedRisk.riskLevel)}15, ${getRiskColor(selectedRisk.riskLevel)}05)`
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-soft"
                    style={{ backgroundColor: getRiskColor(selectedRisk.riskLevel) }}
                  >
                    {selectedRisk.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-bold px-2 py-1 rounded uppercase"
                        style={{
                          backgroundColor: getRiskColor(selectedRisk.riskLevel),
                          color: 'white'
                        }}
                      >
                        {selectedRisk.riskLevel} Risk
                      </span>
                      <span className="text-xs text-neutral-500">•</span>
                      <span className="text-xs text-neutral-600 font-semibold">
                        {selectedRisk.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 font-display">
                      {selectedRisk.name}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-neutral-400 hover:text-neutral-700 transition-colors p-2.5 hover:bg-neutral-100 rounded-xl"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto flex-1 bg-neutral-50">
              <div className="space-y-6">
                {selectedRisk.branch.riskAnalyses?.financial && (
                  <div className="bg-white rounded-xl p-5 border border-neutral-200">
                    <h5 className="font-semibold text-emerald-700 mb-2 flex items-center gap-2 text-lg">
                      <span>💰</span> Financial Risk
                    </h5>
                    <div className="prose prose-sm max-w-none text-neutral-700">
                      <ReactMarkdown>
                        {selectedRisk.branch.riskAnalyses.financial}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {selectedRisk.branch.riskAnalyses?.technical && (
                  <div className="bg-white rounded-xl p-5 border border-neutral-200">
                    <h5 className="font-semibold text-blue-700 mb-2 flex items-center gap-2 text-lg">
                      <span>⚙️</span> Technical Risk
                    </h5>
                    <div className="prose prose-sm max-w-none text-neutral-700">
                      <ReactMarkdown>
                        {selectedRisk.branch.riskAnalyses.technical}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {selectedRisk.branch.riskAnalyses?.organizational && (
                  <div className="bg-white rounded-xl p-5 border border-neutral-200">
                    <h5 className="font-semibold text-purple-700 mb-2 flex items-center gap-2 text-lg">
                      <span>👥</span> Organizational Risk
                    </h5>
                    <div className="prose prose-sm max-w-none text-neutral-700">
                      <ReactMarkdown>
                        {selectedRisk.branch.riskAnalyses.organizational}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {selectedRisk.branch.riskAnalyses?.ecosystem && (
                  <div className="bg-white rounded-xl p-5 border border-neutral-200">
                    <h5 className="font-semibold text-amber-700 mb-2 flex items-center gap-2 text-lg">
                      <span>🌐</span> Ecosystem Risk
                    </h5>
                    <div className="prose prose-sm max-w-none text-neutral-700">
                      <ReactMarkdown>
                        {selectedRisk.branch.riskAnalyses.ecosystem}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Overall Reasoning */}
                {selectedRisk.branch.reasoning && (
                  <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-5 border border-primary-200">
                    <h5 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                      <span>💡</span> Overall Risk Assessment
                    </h5>
                    <div className="prose prose-sm max-w-none text-neutral-700">
                      <ReactMarkdown>
                        {selectedRisk.branch.reasoning}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Mitigation Strategies */}
                {selectedRisk.branch.mitigation && selectedRisk.branch.mitigation.length > 0 && (
                  <div className="bg-white rounded-xl p-5 border border-green-200">
                    <h5 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <span>✅</span> Mitigation Strategies
                    </h5>
                    <ul className="space-y-2">
                      {selectedRisk.branch.mitigation.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700">
                          <span className="text-green-600 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-neutral-200 bg-white flex justify-end">
              <button
                onClick={closeModal}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
