import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, ChevronRight, Search } from 'lucide-react';
import { useData } from '../context/DataContext';

const Reports = () => {
    const { reports: rawReports, isLoading } = useData();
    
    // Sort reports by date descending
    const reports = [...rawReports].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
                        <FileText className="w-8 h-8 text-indigo-500" />
                        Validation Reports
                    </h1>
                    <p className="text-slate-400">History of your hypothesis validation runs.</p>
                </div>
            </div>

            {reports.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
                    <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-300 mb-2">No reports found</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">
                        Run a validation in the Reasoning Lab to generate your first report.
                    </p>
                    <Link
                        to="/reasoning-lab"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                    >
                        Go to Reasoning Lab
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {reports.map((report) => (
                        <Link
                            key={report.id}
                            to={`/reports/${report.id}`}
                            className="group block bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-white mb-1 group-hover:text-indigo-400 transition-colors">
                                            Validation Run
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-slate-400">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(report.date).toLocaleString()}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                            <span>
                                                {report.hypotheses.length} Hypotheses
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                            <span>
                                                {report.hypotheses.filter(h => h.status === 'verified').length} Validated
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reports;
