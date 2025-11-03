import ReactMarkdown from 'react-markdown';

export default function BranchCard({ branch, index }) {
  const getRiskColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'HIGH':
        return {
          bg: 'bg-red-50',
          border: 'border-red-300',
          text: 'text-red-800',
          badge: 'bg-red-100 text-red-700 border-red-300',
          gradient: 'from-red-50 to-red-100',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-300',
          text: 'text-amber-800',
          badge: 'bg-amber-100 text-amber-700 border-amber-300',
          gradient: 'from-amber-50 to-amber-100',
        };
      case 'LOW':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-300',
          text: 'text-emerald-800',
          badge: 'bg-emerald-100 text-emerald-700 border-emerald-300',
          gradient: 'from-emerald-50 to-emerald-100',
        };
      default:
        return {
          bg: 'bg-neutral-50',
          border: 'border-neutral-300',
          text: 'text-neutral-800',
          badge: 'bg-neutral-100 text-neutral-700 border-neutral-300',
          gradient: 'from-neutral-50 to-neutral-100',
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
      <div className={`bg-gradient-to-br ${colors.gradient} p-6 border-b border-neutral-200`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-neutral-500 tracking-wider uppercase">
                Option {index + 1}
              </span>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2 font-display">
              {branch.name}
            </h3>
            <p className="text-neutral-700 text-sm leading-relaxed">{branch.description}</p>
          </div>
          <div
            className={`
              px-3 py-2 rounded-xl border-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide
              ${colors.badge} shadow-sm flex-shrink-0
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
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Risk Assessment</h4>
            </div>
            <div className="text-sm text-neutral-700 bg-neutral-50 p-4 rounded-xl border border-neutral-200 prose prose-sm max-w-none">
              <ReactMarkdown>{branch.reasoning}</ReactMarkdown>
            </div>
          </div>
        )}

        {branch.riskAnalyses && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-3">Risk Breakdown</h4>
            
            {branch.riskAnalyses.financial && (
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h5 className="text-sm font-bold text-emerald-900">Financial Risks</h5>
                </div>
                <div className="text-xs text-neutral-700 prose prose-sm max-w-none pl-9">
                  <ReactMarkdown>{branch.riskAnalyses.financial}</ReactMarkdown>
                </div>
              </div>
            )}
            
            {branch.riskAnalyses.technical && (
              <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h5 className="text-sm font-bold text-blue-900">Technical Risks</h5>
                </div>
                <div className="text-xs text-neutral-700 prose prose-sm max-w-none pl-9">
                  <ReactMarkdown>{branch.riskAnalyses.technical}</ReactMarkdown>
                </div>
              </div>
            )}
            
            {branch.riskAnalyses.organizational && (
              <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h5 className="text-sm font-bold text-purple-900">Organizational Risks</h5>
                </div>
                <div className="text-xs text-neutral-700 prose prose-sm max-w-none pl-9">
                  <ReactMarkdown>{branch.riskAnalyses.organizational}</ReactMarkdown>
                </div>
              </div>
            )}

            {branch.riskAnalyses.ecosystem && (
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v7h10v-7a2 2 0 012-2h1.945a.5.5 0 00.374-.832l-9.445-9.445a.5.5 0 00-.708 0L2.68 10.168a.5.5 0 00.374.832z" />
                    </svg>
                  </div>
                  <h5 className="text-sm font-bold text-amber-900">Ecosystem Risks</h5>
                </div>
                <div className="text-xs text-neutral-700 prose prose-sm max-w-none pl-9">
                  <ReactMarkdown>{branch.riskAnalyses.ecosystem}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}

        {branch.mitigation && branch.mitigation.length > 0 && (
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-5 border border-primary-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Mitigation Strategies</h4>
            </div>
            <ul className="space-y-2.5">
              {branch.mitigation.map((strategy, idx) => (
                <li key={idx} className="text-sm text-neutral-800 flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="leading-relaxed">{strategy}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!branch.riskAnalyses && (
          <div className="text-center py-8 bg-neutral-50 rounded-xl border border-neutral-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-3">
              <svg className="w-6 h-6 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-neutral-600 text-sm font-medium">Analyzing risks...</p>
          </div>
        )}
      </div>
    </div>
  );
}

