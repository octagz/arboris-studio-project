import React, { useState } from 'react';
import { Brain, Plus, CheckCircle2, XCircle, Sparkles, RefreshCw, ChevronRight, Trash2 } from 'lucide-react';
import { validateHypotheses } from '../services/aiService';
import { mockInterviews, mockHypotheses } from '../services/mockData';

const ReasoningLab = () => {
    const [hypotheses, setHypotheses] = useState(mockHypotheses);
    const [newHypothesis, setNewHypothesis] = useState('');
    const [isValidating, setIsValidating] = useState(false);

    const addHypothesis = () => {
        if (!newHypothesis.trim()) return;
        setHypotheses([
            ...hypotheses,
            { id: Date.now(), text: newHypothesis, status: 'unverified', evidence: [], supportingEvidence: 0, againstEvidence: 0 }
        ]);
        setNewHypothesis('');
    };

    const deleteHypothesis = (id) => {
        setHypotheses(hypotheses.filter(h => h.id !== id));
    };

    const handleValidate = async () => {
        setIsValidating(true);
        try {
            // Get all transcripts
            const transcripts = mockInterviews.map(i => ({
                id: i.id,
                interviewee: i.interviewee,
                text: i.transcript
            })).filter(t => t.text); // Only those with transcripts

            console.log('[ReasoningLab] Starting validation with', hypotheses.length, 'hypotheses');
            const results = await validateHypotheses(hypotheses, transcripts);
            console.log('[ReasoningLab] Validation results:', results);

            // Merge results back into hypotheses
            const updatedHypotheses = hypotheses.map(h => {
                const result = results.find(r => r.id === h.id || r.id === String(h.id));
                if (result) {
                    // Calculate supporting and against evidence counts from the evidence array
                    const evidenceArray = result.evidence || [];
                    const supportingEvidence = evidenceArray.filter(e => e.type === 'supporting').length;
                    const againstEvidence = evidenceArray.filter(e => e.type === 'refuting').length;
                    
                    return { 
                        ...h, 
                        ...result, 
                        supportingEvidence,
                        againstEvidence,
                        status: 'verified' 
                    };
                }
                return h;
            });

            setHypotheses(updatedHypotheses);

            // Save report to localStorage
            const newReport = {
                id: Date.now(),
                date: new Date().toISOString(),
                hypotheses: updatedHypotheses
            };

            const savedReports = localStorage.getItem('market_validation_reports');
            const reports = savedReports ? JSON.parse(savedReports) : [];
            reports.push(newReport);
            localStorage.setItem('market_validation_reports', JSON.stringify(reports));
        } catch (error) {
            console.error("Validation failed:", error);
            alert(`Validation failed: ${error.message}`);
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
                        <Brain className="w-8 h-8 text-indigo-500" />
                        Reasoning Lab
                    </h1>
                    <p className="text-slate-400">Define hypotheses and validate them against your interview evidence.</p>
                </div>
                <button
                    onClick={handleValidate}
                    disabled={isValidating}
                    className="px-6 py-2.5 text-white bg-indigo-600 rounded-lg font-medium shadow-lg shadow-indigo-900/20 hover:bg-indigo-500 hover:shadow-indigo-900/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isValidating ? (
                        <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Validating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            Validate Hypotheses
                        </>
                    )}
                </button>
            </div>

            {/* Input Section */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8">
                <label className="block text-sm font-medium text-slate-300 mb-3">Add New Hypothesis</label>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newHypothesis}
                        onChange={(e) => setNewHypothesis(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addHypothesis()}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="e.g. Customers are willing to pay more for advanced reporting..."
                    />
                    <button
                        onClick={addHypothesis}
                        className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add
                    </button>
                </div>
            </div>

            {/* Hypotheses List */}
            <div className="space-y-6">
                {hypotheses.map((hypothesis) => (
                    <div key={hypothesis.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all hover:border-slate-700">
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
                                <button
                                    onClick={() => deleteHypothesis(hypothesis.id)}
                                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                    title="Delete hypothesis"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
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

export default ReasoningLab;
