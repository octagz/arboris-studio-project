import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Search, Filter, MoreHorizontal, ChevronRight, Plus } from 'lucide-react';

const Interviews = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    
    // Get interviews from context
    const { interviews: allInterviews, isLoading } = useData();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading...</div>
            </div>
        );
    }

    const filteredInterviews = allInterviews.filter(interview =>
        interview.interviewee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Interviews</h2>
                    <p className="text-slate-400 mt-1">Manage and analyze your interview sessions</p>
                </div>
                <button
                    onClick={() => navigate('/new-interview')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center shadow-lg shadow-indigo-900/20 transition-all hover:-translate-y-0.5"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Interview
                </button>
            </div>

            <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search interviews..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                                <th className="p-4">Interviewee</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Duration</th>
                                <th className="p-4">Status</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredInterviews.length > 0 ? (
                                filteredInterviews.map((interview) => (
                                    <tr
                                        key={interview.id}
                                        onClick={() => navigate(`/interview/${interview.id}`)}
                                        className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold text-xs border border-slate-700">
                                                    {interview.interviewee.charAt(0)}
                                                </div>
                                                <span className="font-medium text-slate-200">{interview.interviewee}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">{interview.role}</td>
                                        <td className="p-4 text-slate-400 text-sm">{interview.date}</td>
                                        <td className="p-4 text-slate-400 text-sm">{interview.duration}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${interview.status === 'Completed'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                {interview.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 italic">
                                        No interviews found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-800 flex justify-between items-center text-sm text-slate-500 bg-slate-900/50">
                    <span>Showing 1 to {filteredInterviews.length} of {filteredInterviews.length} results</span>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 border border-slate-700 rounded-md hover:bg-slate-800 hover:text-slate-300 disabled:opacity-50 transition-colors" disabled>Previous</button>
                        <button className="px-3 py-1 border border-slate-700 rounded-md hover:bg-slate-800 hover:text-slate-300 disabled:opacity-50 transition-colors" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Interviews;
