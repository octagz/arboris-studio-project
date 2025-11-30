import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle2, XCircle, FileText } from 'lucide-react';

const ReportDetail = () => {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedReports = localStorage.getItem('market_validation_reports');
        if (savedReports) {
            try {
                const parsedReports = JSON.parse(savedReports);
                const foundReport = parsedReports.find(r => r.id.toString() === id);
                setReport(foundReport);
            } catch (e) {
                console.error("Failed to parse reports", e);
            }
        }
        setLoading(false);
    }, [id]);

    if (loading) {
        return <div className="text-center py-20 text-slate-500">Loading report...</div>;
    }

    if (!report) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold text-white mb-2">Report not found</h2>
                <Link to="/reports" className="text-indigo-400 hover:text-indigo-300">
                    Back to Reports
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <Link
                to="/reports"
                className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Reports
            </Link>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
                        <FileText className="w-8 h-8 text-indigo-500" />
                        Validation Report
                    </h1>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(report.date).toLocaleString()}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {report.hypotheses.map((hypothesis) => (
                    <div key={hypothesis.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-white mb-2">{hypothesis.text}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${hypothesis.status === 'verified'
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-slate-800 text-slate-400 border-slate-700'
                                            }`}>
                                            {hypothesis.status === 'verified' ? 'Validated' : 'Unverified'}
                                        </span>
                                        {hypothesis.confidence && (
                                            <span className="text-xs text-slate-500">
                                                Confidence: {(hypothesis.confidence * 100).toFixed(0)}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Evidence Section */}
                            {hypothesis.evidence && hypothesis.evidence.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-slate-800/50">
                                    <h4 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Evidence</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Supporting Evidence */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-2">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Supporting
                                            </div>
                                            {hypothesis.evidence.filter(e => e.type === 'supporting').map((item, idx) => (
                                                <div key={idx} className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 text-sm">
                                                    <p className="text-slate-300 mb-2">"{item.quote}"</p>
                                                    <div className="flex items-center gap-2 text-xs text-emerald-500/70">
                                                        <span className="font-medium">{item.source}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {hypothesis.evidence.filter(e => e.type === 'supporting').length === 0 && (
                                                <p className="text-sm text-slate-600 italic">No supporting evidence found.</p>
                                            )}
                                        </div>

                                        {/* Refuting Evidence */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-rose-400 text-sm font-medium mb-2">
                                                <XCircle className="w-4 h-4" />
                                                Refuting
                                            </div>
                                            {hypothesis.evidence.filter(e => e.type === 'refuting').map((item, idx) => (
                                                <div key={idx} className="bg-rose-500/5 border border-rose-500/10 rounded-lg p-3 text-sm">
                                                    <p className="text-slate-300 mb-2">"{item.quote}"</p>
                                                    <div className="flex items-center gap-2 text-xs text-rose-500/70">
                                                        <span className="font-medium">{item.source}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {hypothesis.evidence.filter(e => e.type === 'refuting').length === 0 && (
                                                <p className="text-sm text-slate-600 italic">No refuting evidence found.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportDetail;
