import ReactMarkdown from 'react-markdown';

export default function BranchCard({ branch, index }) {
  const getRiskColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'HIGH':
        return {
        badge: 'bg-[rgba(213,75,75,0.18)] text-error border-[rgba(213,75,75,0.55)]',
        gradient: 'from-[rgba(213,75,75,0.35)] via-[rgba(18,72,60,0.45)] to-[rgba(7,27,23,0.75)]',
        };
      case 'MEDIUM':
        return {
        badge: 'bg-[rgba(212,175,55,0.2)] text-gold-base border-[rgba(212,175,55,0.55)]',
        gradient: 'from-[rgba(212,175,55,0.28)] via-[rgba(18,72,60,0.45)] to-[rgba(7,27,23,0.75)]',
        };
      case 'LOW':
        return {
        badge: 'bg-[rgba(37,183,138,0.2)] text-success border-[rgba(37,183,138,0.6)]',
        gradient: 'from-[rgba(37,183,138,0.24)] via-[rgba(18,72,60,0.45)] to-[rgba(7,27,23,0.75)]',
        };
      default:
        return {
        badge: 'bg-[rgba(67,160,137,0.18)] text-seafoam border-[rgba(67,160,137,0.45)]',
        gradient: 'from-[rgba(67,160,137,0.24)] via-[rgba(18,72,60,0.45)] to-[rgba(7,27,23,0.75)]',
        };
    }
  };

  const getRiskIcon = (level) => {
    switch (level?.toUpperCase()) {
      case 'HIGH':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'MEDIUM':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'LOW':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
    }
  };

  const colors = getRiskColor(branch.riskLevel);

  return (
    <div className="card-elevated group overflow-hidden">
      {/* Header with gradient accent */}
      <div className={`bg-gradient-to-br ${colors.gradient} p-6 border-b border-[rgba(19,68,59,0.45)]`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-muted tracking-[0.2em] uppercase">
                Option {index + 1}
              </span>
            </div>
            <h3 className="text-xl font-bold text-fog mb-2 font-display">
              {branch.name}
            </h3>
            <p className="text-seafoam text-sm leading-relaxed">{branch.description}</p>
          </div>
          <div
            className={`
              px-3 py-2 rounded-xl border-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide
              ${colors.badge} flex-shrink-0 shadow-glow
            `}
          >
            {getRiskIcon(branch.riskLevel)}
            <span>{branch.riskLevel || 'Analyzing'}</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {branch.reasoning && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-[rgba(67,160,137,0.45)] bg-[rgba(7,27,23,0.65)]">
                <svg className="w-4 h-4 text-gold-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-fog uppercase tracking-[0.18em]">Risk Assessment</h4>
            </div>
            <div className="text-sm text-seafoam bg-[rgba(7,27,23,0.6)] p-4 rounded-xl border border-[rgba(19,68,59,0.55)] prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{branch.reasoning}</ReactMarkdown>
            </div>
          </div>
        )}

        {branch.riskAnalyses && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-fog uppercase tracking-[0.18em] mb-3">Risk Breakdown</h4>
            
            {branch.riskAnalyses.financial && (
              <div className="bg-[rgba(7,27,23,0.6)] border border-[rgba(37,183,138,0.55)] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[rgba(37,183,138,0.25)]">
                    <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h5 className="text-sm font-bold text-success">Financial Risks</h5>
                </div>
                <div className="text-xs text-seafoam prose prose-invert prose-sm max-w-none pl-9">
                  <ReactMarkdown>{branch.riskAnalyses.financial}</ReactMarkdown>
                </div>
              </div>
            )}
            
            {branch.riskAnalyses.technical && (
              <div className="bg-[rgba(7,27,23,0.6)] border border-[rgba(67,160,213,0.45)] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[rgba(67,160,213,0.28)]">
                    <svg className="w-4 h-4 text-[rgba(130,195,255,0.95)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h5 className="text-sm font-bold text-[rgba(130,195,255,0.95)]">Technical Risks</h5>
                </div>
                <div className="text-xs text-seafoam prose prose-invert prose-sm max-w-none pl-9">
                  <ReactMarkdown>{branch.riskAnalyses.technical}</ReactMarkdown>
                </div>
              </div>
            )}
            
            {branch.riskAnalyses.organizational && (
              <div className="bg-[rgba(7,27,23,0.6)] border border-[rgba(160,140,255,0.45)] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[rgba(160,140,255,0.28)]">
                    <svg className="w-4 h-4 text-[rgba(187,169,255,0.95)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h5 className="text-sm font-bold text-[rgba(187,169,255,0.95)]">Organizational Risks</h5>
                </div>
                <div className="text-xs text-seafoam prose prose-invert prose-sm max-w-none pl-9">
                  <ReactMarkdown>{branch.riskAnalyses.organizational}</ReactMarkdown>
                </div>
              </div>
            )}

            {branch.riskAnalyses.ecosystem && (
              <div className="bg-[rgba(7,27,23,0.6)] border border-[rgba(212,175,55,0.5)] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[rgba(212,175,55,0.25)]">
                    <svg className="w-4 h-4 text-gold-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v7h10v-7a2 2 0 012-2h1.945a.5.5 0 00.374-.832l-9.445-9.445a.5.5 0 00-.708 0L2.68 10.168a.5.5 0 00.374.832z" />
                    </svg>
                  </div>
                  <h5 className="text-sm font-bold text-gold-base">Ecosystem Risks</h5>
                </div>
                <div className="text-xs text-seafoam prose prose-invert prose-sm max-w-none pl-9">
                  <ReactMarkdown>{branch.riskAnalyses.ecosystem}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}

        {branch.mitigation && branch.mitigation.length > 0 && (
          <div className="bg-[rgba(7,27,23,0.6)] rounded-xl p-5 border border-[rgba(67,160,137,0.55)]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[rgba(15,107,92,0.85)] border border-[rgba(67,160,137,0.55)]">
                <svg className="w-4 h-4 text-gold-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-fog uppercase tracking-[0.18em]">Mitigation Strategies</h4>
            </div>
            <ul className="space-y-2.5">
              {branch.mitigation.map((strategy, idx) => (
                <li key={idx} className="text-sm text-seafoam flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="leading-relaxed">{strategy}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!branch.riskAnalyses && (
          <div className="text-center py-8 bg-[rgba(7,27,23,0.55)] rounded-xl border border-[rgba(19,68,59,0.55)]">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 border border-[rgba(67,160,137,0.45)] bg-[rgba(11,61,52,0.7)]">
              <svg className="w-6 h-6 text-gold-base animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-seafoam text-sm font-medium">Analyzing risks...</p>
          </div>
        )}
      </div>
    </div>
  );
}

