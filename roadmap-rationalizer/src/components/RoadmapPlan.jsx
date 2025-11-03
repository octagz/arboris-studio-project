import { useState, useEffect, useMemo } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { generateRoadmapRecommendations } from '../services/perplexityApi';

function RoadmapPlan({ branches, context, decisionYear }) {
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const displayYear = decisionYear ?? 2025;
  const showLegacySections = false;

  useEffect(() => {
    if (branches && branches.length > 0 && context) {
      loadRecommendations();
    }
  }, [branches, context, displayYear]);

  const loadRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateRoadmapRecommendations(context, branches, displayYear);
      setRecommendations(result);
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError(err.message || 'Failed to generate recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const sequencedDecisions = useMemo(() => {
    if (!recommendations?.decisionTimeline) {
      return [];
    }

    return [...recommendations.decisionTimeline].sort((a, b) => {
      if (typeof a?.sequence === 'number' && typeof b?.sequence === 'number') {
        return a.sequence - b.sequence;
      }

      const yearDiff = (a?.year ?? 0) - (b?.year ?? 0);
      if (yearDiff !== 0) {
        return yearDiff;
      }

      return (a?.decision || '').localeCompare(b?.decision || '');
    });
  }, [recommendations?.decisionTimeline]);

  if (isLoading) {
    return (
      <div className="card p-12">
        <LoadingSpinner message="Generating strategic roadmap recommendations..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 bg-[rgba(213,75,75,0.18)] border border-[rgba(213,75,75,0.55)]">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[rgba(213,75,75,0.25)] rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-error mb-2">Error Generating Recommendations</h3>
            <p className="text-seafoam text-sm">{error}</p>
            <button
              onClick={loadRecommendations}
              className="mt-4 btn-gold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="card p-8">
        <p className="text-seafoam text-center">No recommendations available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Executive Summary */}
      {showLegacySections && (
        <div className="card-elevated p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2 font-display">
                Strategic Roadmap Plan
              </h2>
              <p className="text-neutral-600">
                AI-generated recommendations based on comprehensive risk analysis
              </p>
              <p className="mt-1 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Decision Year: {displayYear}
              </p>
            </div>
          </div>

          <div className="prose prose-neutral max-w-none">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-200">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Executive Summary
              </h3>
              <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                {recommendations.executiveSummary}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sequenced Business Decisions */}
      {sequencedDecisions.length > 0 && (
        <div className="card p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h3 className="text-xl font-bold text-fog flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center branch-depth bg-[linear-gradient(145deg,#1A8A74,#0F6B5C)] text-gold-base">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Sequenced Business Decisions
            </h3>
            <span className="text-xs font-semibold text-muted uppercase tracking-[0.2em]">Starting {displayYear}</span>
          </div>
          <div className="relative pl-6">
            <div className="absolute left-3 top-2 bottom-2 w-px bg-[rgba(67,160,137,0.45)]" aria-hidden="true" />
            {sequencedDecisions.map((item, index) => {
              const badgeStyles = [
                'bg-[rgba(212,175,55,0.9)] text-[#1a1a1a]',
                'bg-[rgba(37,183,138,0.9)] text-fog',
                'bg-[rgba(67,160,137,0.9)] text-fog',
                'bg-[rgba(130,195,255,0.9)] text-[#041512]'
              ];
              const badgeClass = badgeStyles[index % badgeStyles.length];
              return (
                <div key={`${item.sequence}-${item.decision}`} className="relative pb-8 last:pb-0">
                  <div className={`absolute -left-3 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-satin ${badgeClass}`}>{item.sequence ?? index + 1}</div>
                  <div className="bg-[rgba(7,27,23,0.6)] border border-[rgba(19,68,59,0.55)] rounded-xl p-5">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="text-sm font-semibold text-fog">
                        {item.year ?? displayYear}{item.quarter ? ` · ${item.quarter}` : ''}
                      </span>
                      <span className="px-2 py-1 text-xs font-semibold rounded-lg uppercase tracking-[0.18em] bg-[rgba(67,160,137,0.22)] text-success border border-[rgba(67,160,137,0.55)]">
                        {item.decision || 'Strategic Decision'}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-seafoam mb-4 leading-relaxed">{item.description}</p>
                    )}
                    {item.linkedRisk && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted uppercase tracking-[0.18em] mb-2">
                          <svg className="w-4 h-4 text-gold-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Linked Risk Mitigated
                        </div>
                        <div className="bg-[rgba(7,27,23,0.55)] border border-[rgba(212,175,55,0.55)] rounded-lg p-3 text-sm text-gold-base space-y-1">
                          <div className="font-semibold text-fog">
                            {item.linkedRisk.branch || 'Referenced Branch'} · {item.linkedRisk.riskDimension || 'Risk'} ({item.linkedRisk.severity || 'MEDIUM'})
                          </div>
                          {item.linkedRisk.riskStatement && (
                            <p className="text-seafoam leading-relaxed">{item.linkedRisk.riskStatement}</p>
                          )}
                        </div>
                      </div>
                    )}
                    {item.mitigationRationale && (
                      <div className="bg-[rgba(7,27,23,0.55)] border border-[rgba(37,183,138,0.55)] rounded-lg p-3 text-sm text-seafoam">
                        <span className="font-semibold uppercase tracking-[0.18em] text-xs text-success block mb-1">Mitigation Justification</span>
                        <p className="leading-relaxed">{item.mitigationRationale}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Prioritization */}
      {showLegacySections && (
        <div className="card p-8">
          <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            Recommended Prioritization
          </h3>
          <div className="space-y-6">
            {recommendations.prioritizedOptions && recommendations.prioritizedOptions.map((option, index) => {
              const priorityColors = {
                1: 'from-emerald-500 to-emerald-600',
                2: 'from-primary-500 to-primary-600',
                3: 'from-amber-500 to-amber-600',
              };
              const priorityBg = {
                1: 'bg-emerald-50 border-emerald-200',
                2: 'bg-primary-50 border-primary-200',
                3: 'bg-amber-50 border-amber-200',
              };

              return (
                <div key={index} className={`border-2 rounded-xl p-6 ${priorityBg[option.priority] || 'bg-neutral-50 border-neutral-200'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${priorityColors[option.priority] || 'from-neutral-500 to-neutral-600'} rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg`}>
                      {option.priority}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-neutral-900 mb-2">
                        {option.name}
                      </h4>
                      <p className="text-neutral-700 mb-4 leading-relaxed">
                        {option.rationale}
                      </p>
                      {option.timeline && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">Timeline: {option.timeline}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Strategic Actions */}
      {showLegacySections && (
        <div className="card p-8">
          <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            Strategic Action Items
          </h3>
          <div className="space-y-4">
            {recommendations.actionItems && recommendations.actionItems.map((action, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                <div className="w-8 h-8 bg-secondary-600 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-neutral-900 mb-1">
                    {action.title}
                  </h4>
                  <p className="text-neutral-700 text-sm mb-2">
                    {action.description}
                  </p>
                  {action.owner && (
                    <div className="flex items-center gap-4 text-xs text-neutral-600">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {action.owner}
                      </span>
                      {action.timeframe && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {action.timeframe}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Mitigation Priorities */}
      {showLegacySections && (
        <div className="card p-8">
          <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            Key Risk Mitigation Priorities
          </h3>
          <div className="space-y-3">
            {recommendations.riskMitigationPriorities && recommendations.riskMitigationPriorities.map((risk, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-900 mb-1">{risk.area}</h4>
                  <p className="text-amber-800 text-sm">{risk.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Metrics */}
      {showLegacySections && recommendations.successMetrics && (
        <div className="card p-8">
          <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-teal/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-accent-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            Success Metrics & KPIs
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.successMetrics.map((metric, index) => (
              <div key={index} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <h4 className="font-semibold text-neutral-900 mb-2">{metric.name}</h4>
                <p className="text-neutral-700 text-sm">{metric.description}</p>
                {metric.target && (
                  <div className="mt-2 text-xs font-medium text-accent-teal">
                    Target: {metric.target}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {showLegacySections && (
        <div className="card-elevated p-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
          <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-3">
            <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Immediate Next Steps
          </h3>
          <div className="space-y-3">
            {recommendations.nextSteps && recommendations.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  {index + 1}
                </div>
                <p className="text-neutral-700 pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RoadmapPlan;

