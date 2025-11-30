import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, FileText, Sparkles, Tag, ChevronLeft, Plus, Download, Share2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { generateSummary, extractThemes } from '../services/aiService';

const InterviewDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [interview, setInterview] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState('transcript');
    const [loadingAI, setLoadingAI] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [isTagging, setIsTagging] = useState(false);

    // Get data from context
    const { findInterviewById, updateInterview, isLoading } = useData();

    useEffect(() => {
        if (!isLoading) {
            const found = findInterviewById(id);
            if (found) {
                setInterview(found);
            }
        }
    }, [id, isLoading, findInterviewById]);

    const handleGenerateInsights = async () => {
        if (!interview) return;
        setLoadingAI(true);
        try {
            const summary = await generateSummary(interview.transcript);
            const themes = await extractThemes(interview.transcript);

            setInterview(prev => ({
                ...prev,
                summary,
                themes
            }));
        } catch (error) {
            console.error("Error generating insights:", error);
            alert(`Failed to generate insights: ${error.message}`);
        } finally {
            setLoadingAI(false);
        }
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && newTag.trim()) {
            setInterview(prev => ({
                ...prev,
                themes: [...(prev.themes || []), newTag.trim()]
            }));
            setNewTag('');
            setIsTagging(false);
        }
    };

    const handleExport = () => {
        if (!interview) return;
        const dataStr = JSON.stringify(interview, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `interview_${interview.interviewee.replace(/\s+/g, '_').toLowerCase()}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    if (!interview) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-6">
                <button onClick={() => navigate('/interviews')} className="p-2 hover:bg-slate-800 hover:shadow-sm rounded-full transition-all border border-transparent hover:border-slate-700">
                    <ChevronLeft className="w-6 h-6 text-slate-400" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">{interview.interviewee}</h1>
                    <p className="text-slate-400 text-sm font-medium">{interview.role} at {interview.company} • {interview.date}</p>
                </div>
                <div className="ml-auto flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${interview.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                        {interview.status}
                    </span>
                    <button
                        onClick={handleExport}
                        className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-slate-800 hover:shadow-sm border border-transparent hover:border-slate-700 rounded-full transition-all"
                        title="Export JSON"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-slate-800 hover:shadow-sm border border-transparent hover:border-slate-700 rounded-full transition-all">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Left Column: Media & Transcript (8 cols) */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    {/* Audio Player Card */}
                    <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-4 w-full">
                                <button
                                    className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-900/40 cursor-pointer hover:bg-indigo-500 hover:scale-105 transition-all"
                                    onClick={() => setIsPlaying(!isPlaying)}
                                >
                                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                                </button>
                                <div className="flex-1 space-y-2">
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 w-1/3 rounded-full relative">
                                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full shadow-sm"></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs font-medium text-slate-500">
                                        <span className="text-indigo-400">12:30</span>
                                        <span>{interview.duration}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-1 ml-4">
                                <button className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-indigo-400 transition-colors"><SkipBack className="w-5 h-5" /></button>
                                <button className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-indigo-400 transition-colors"><SkipForward className="w-5 h-5" /></button>
                            </div>
                        </div>
                    </div>

                    {/* Transcript / Notes Tabs */}
                    <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden min-h-[600px] flex flex-col">
                        <div className="flex border-b border-slate-800">
                            <button
                                className={`flex-1 py-4 text-sm font-semibold text-center transition-colors ${activeTab === 'transcript' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
                                onClick={() => setActiveTab('transcript')}
                            >
                                Transcript
                            </button>
                            <button
                                className={`flex-1 py-4 text-sm font-semibold text-center transition-colors ${activeTab === 'notes' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
                                onClick={() => setActiveTab('notes')}
                            >
                                Notes
                            </button>
                        </div>

                        <div className="p-8 flex-1">
                            {activeTab === 'transcript' ? (
                                <div className="prose prose-invert prose-slate prose-sm max-w-none">
                                    {interview.transcript ? (
                                        <div className="space-y-4">
                                            {interview.transcript.split('\n\n').map((paragraph, idx) => (
                                                <p key={idx} className="text-slate-300 leading-relaxed">
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20">
                                            <FileText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                                            <p className="text-slate-500 italic">No transcript available.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <textarea
                                    className="w-full h-full min-h-[500px] p-4 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none text-slate-200 placeholder-slate-500 bg-slate-950/50"
                                    placeholder="Add your notes here..."
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: AI Insights (4 cols) */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-slate-900 rounded-xl border border-indigo-500/20 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 p-4 border-b border-indigo-500/20 flex justify-between items-center">
                            <div className="flex items-center space-x-2 text-indigo-200">
                                <Sparkles className="w-4 h-4 text-indigo-400" />
                                <h3 className="font-semibold text-sm">AI Insights</h3>
                            </div>
                            <button
                                onClick={handleGenerateInsights}
                                disabled={loadingAI}
                                className="text-xs bg-slate-800 px-3 py-1 rounded-full shadow-sm border border-slate-700 text-indigo-400 font-medium hover:bg-slate-700 disabled:opacity-50 transition-all hover:shadow-md"
                            >
                                {loadingAI ? 'Analyzing...' : 'Refresh'}
                            </button>
                        </div>

                        <div className="p-6 space-y-8">
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                                    Summary
                                </h4>
                                <div className="text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                    {interview.summary || "No summary generated yet. Click 'Refresh' to analyze."}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Themes</h4>
                                    <button
                                        onClick={() => setIsTagging(!isTagging)}
                                        className="text-indigo-400 hover:text-indigo-300 p-1 hover:bg-indigo-500/10 rounded transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {isTagging && (
                                    <div className="mb-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <input
                                            type="text"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyDown={handleAddTag}
                                            placeholder="Type tag & press Enter"
                                            className="w-full px-3 py-2 text-sm bg-slate-950 border border-indigo-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-200 placeholder-slate-500"
                                            autoFocus
                                        />
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    {interview.themes && interview.themes.length > 0 ? (
                                        interview.themes.map((theme, idx) => (
                                            <span key={`${theme}-${idx}`} className="flex items-center px-2.5 py-1 bg-slate-800 rounded-lg text-xs font-medium text-slate-300 border border-slate-700 shadow-sm hover:border-indigo-500/30 hover:text-indigo-400 transition-colors cursor-default">
                                                <Tag className="w-3 h-3 mr-1.5 text-indigo-500/70" />
                                                {theme}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-slate-500 italic">No themes detected.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewDetail;
