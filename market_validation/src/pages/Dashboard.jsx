import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { mockInterviews, mockTrends, mockStats, mockDemographics, mockAgeDistribution, mockGenderDistribution, mockHypotheses } from '../services/mockData';
import { PlayCircle, FileText, MoreHorizontal, TrendingUp, Sparkles, Calendar, ChevronLeft, ChevronRight, Clock, Lightbulb, ThumbsUp, ThumbsDown } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
    const navigate = useNavigate();
    const [demographicView, setDemographicView] = useState('role'); // 'role', 'age', 'gender'
    const [allInterviews, setAllInterviews] = useState(mockInterviews);

    useEffect(() => {
        // Load user interviews from localStorage and combine with mock data
        const savedInterviews = localStorage.getItem('user_interviews');
        const userInterviews = savedInterviews ? JSON.parse(savedInterviews) : [];
        setAllInterviews([...userInterviews, ...mockInterviews]);
    }, []);

    // Chart Data Configuration
    const donutData = {
        labels: ['Completed', 'In Progress', 'Scheduled'],
        datasets: [
            {
                data: [mockStats.completed, mockStats.inProgress, mockStats.scheduled],
                backgroundColor: ['#4F46E5', '#F59E0B', '#E5E7EB'],
                borderWidth: 0,
            },
        ],
    };

    const getDemographicsData = () => {
        let data, labels, label;
        switch (demographicView) {
            case 'age':
                data = mockAgeDistribution;
                label = 'Age Group';
                break;
            case 'gender':
                data = mockGenderDistribution;
                label = 'Gender';
                break;
            case 'role':
            default:
                data = mockDemographics;
                label = 'Role';
                break;
        }

        return {
            labels: Object.keys(data),
            datasets: [
                {
                    label: 'Participants',
                    data: Object.values(data),
                    backgroundColor: '#4F46E5',
                    borderRadius: 4,
                },
            ],
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    color: '#94a3b8' // slate-400
                }
            },
        },
        cutout: '70%',
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                beginAtZero: true,
                grid: { display: false, drawBorder: false },
                ticks: { color: '#94a3b8' }
            },
            x: {
                grid: { display: false, drawBorder: false },
                ticks: { color: '#94a3b8' }
            }
        },
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Dashboard</h2>
                    <p className="text-slate-400">Overview of market validation interviews</p>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-400">Project: <strong className="text-white">Market Validation 2024</strong></span>
                </div>
            </header>

            {/* Key Insights Section (Prominent) */}
            <section>
                <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-white">Key Strategic Insights</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gradient-to-br from-indigo-950 to-slate-900 rounded-xl border border-indigo-900 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-900 rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-110 transition-transform"></div>
                        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3">Pain Point</h4>
                        <p className="text-lg text-slate-200 font-medium leading-relaxed">
                            "Users are consistently mentioning <span className="text-indigo-300 bg-indigo-900/50 px-1 rounded">integration fatigue</span>. 80% of recent interviews highlighted data silos as a primary blocker."
                        </p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-orange-950 to-slate-900 rounded-xl border border-orange-900 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-900 rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-110 transition-transform"></div>
                        <h4 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-3">Market Segment</h4>
                        <p className="text-lg text-slate-200 font-medium leading-relaxed">
                            "Pricing sensitivity is significantly higher in the <span className="text-orange-300 bg-orange-900/50 px-1 rounded">startup segment</span> compared to enterprise clients."
                        </p>
                    </div>
                </div>
            </section>

            {/* User Hypotheses Section */}
            <section>
                <div className="flex items-center space-x-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-white">Your Hypotheses</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockHypotheses.map((hypothesis) => {
                        const total = hypothesis.supportingEvidence + hypothesis.againstEvidence;
                        const supportRatio = total > 0 ? (hypothesis.supportingEvidence / total) * 100 : 0;
                        
                        return (
                            <div
                                key={hypothesis.id}
                                className="p-5 bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                        hypothesis.status === 'verified' 
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    }`}>
                                        {hypothesis.status === 'verified' ? 'Validated' : 'Unverified'}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-200 font-medium leading-relaxed mb-4 line-clamp-2">
                                    {hypothesis.text}
                                </p>
                                
                                {hypothesis.status === 'verified' ? (
                                    <>
                                        {/* Evidence progress bar */}
                                        <div className="mb-3">
                                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                                                <div 
                                                    className="bg-emerald-500 transition-all"
                                                    style={{ width: `${supportRatio}%` }}
                                                />
                                                <div 
                                                    className="bg-rose-500 transition-all"
                                                    style={{ width: `${100 - supportRatio}%` }}
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Evidence counts */}
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center space-x-1 text-emerald-400">
                                                <ThumbsUp className="w-3.5 h-3.5" />
                                                <span className="font-semibold">{hypothesis.supportingEvidence}</span>
                                                <span className="text-slate-500">supporting</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-rose-400">
                                                <ThumbsDown className="w-3.5 h-3.5" />
                                                <span className="font-semibold">{hypothesis.againstEvidence}</span>
                                                <span className="text-slate-500">against</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-xs text-slate-500 italic">Not yet validated against interviews</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Interviews */}
                <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-white">Recent Interviews</h3>
                        <button onClick={() => navigate('/interviews')} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium hover:underline">View All</button>
                    </div>
                    <div className="space-y-3 flex-1">
                        {allInterviews.slice(0, 5).map((interview) => (
                            <div
                                key={interview.id}
                                onClick={() => navigate(`/interview/${interview.id}`)}
                                className="flex items-center justify-between p-3 -mx-3 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-semibold text-sm border border-slate-700">
                                        {interview.interviewee.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">{interview.interviewee}</p>
                                        <p className="text-xs text-slate-500">{interview.role}</p>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlayCircle className="w-5 h-5 text-indigo-400 hover:text-indigo-300" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800 text-center">
                        <button
                            onClick={() => navigate('/interviews')}
                            className="text-sm text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
                        >
                            Show more
                        </button>
                    </div>
                </div>

                {/* Interview Status Chart */}
                <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 flex flex-col">
                    <h3 className="font-semibold text-white mb-4">Interview Status</h3>
                    <div className="flex-1 min-h-[300px] relative w-full">
                        <Doughnut data={donutData} options={chartOptions} />
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800">
                    <h3 className="font-semibold text-white mb-4">Top Interviewers</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Alex M.', count: 8, rank: 1 },
                            { name: 'Sarah J.', count: 6, rank: 2 },
                            { name: 'Mike T.', count: 4, rank: 3 },
                        ].map((user) => (
                            <div key={user.name} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${user.rank === 1 ? 'bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/20' :
                                        user.rank === 2 ? 'bg-slate-700 text-slate-300 ring-1 ring-slate-600' :
                                            'bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20'
                                        }`}>
                                        {user.rank}
                                    </span>
                                    <span className="text-sm text-slate-300 font-medium">{user.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{user.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Demographics Chart */}
                <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-white">Demographics</h3>
                        <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
                            {['role', 'age', 'gender'].map((view) => (
                                <button
                                    key={view}
                                    onClick={() => setDemographicView(view)}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${demographicView === view
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                                        }`}
                                >
                                    {view.charAt(0).toUpperCase() + view.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 min-h-[300px] relative w-full">
                        <Bar data={getDemographicsData()} options={barOptions} />
                    </div>
                </div>
            </div>

            {/* Scheduled Interviews (Full Width) */}
            <div className="bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-800">
                <div className="flex items-center space-x-2 mb-6">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-semibold text-white">Scheduled Interviews</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar View (Mock) */}
                    <div className="lg:col-span-1 bg-slate-950 p-6 rounded-xl border border-slate-800">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-white">November 2023</h4>
                            <div className="flex space-x-2">
                                <button className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
                                <button className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                <div key={day} className="text-slate-500 font-medium py-1">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center text-sm">
                            {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                                const isToday = day === 15; // Mock today
                                const hasInterview = [17, 18].includes(day); // Mock scheduled dates
                                return (
                                    <div
                                        key={day}
                                        className={`py-2 rounded-lg cursor-pointer transition-colors ${isToday ? 'bg-indigo-600 text-white font-bold' :
                                            hasInterview ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-medium' :
                                                'text-slate-400 hover:bg-slate-800 hover:text-white'
                                            }`}
                                    >
                                        {day}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Upcoming List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h4 className="font-medium text-slate-300 mb-2">Upcoming Sessions</h4>
                        {allInterviews.filter(i => i.status === 'Scheduled').length > 0 ? (
                            allInterviews.filter(i => i.status === 'Scheduled').map(interview => (
                                <div key={interview.id} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-indigo-500/30 transition-colors group">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-900 rounded-lg border border-slate-700 text-slate-300">
                                            <span className="text-xs font-medium uppercase">{new Date(interview.date).toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-lg font-bold">{new Date(interview.date).getDate()}</span>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">{interview.interviewee}</h5>
                                            <p className="text-sm text-slate-500">{interview.role} at {interview.company}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <div className="text-right">
                                            <div className="flex items-center text-sm text-slate-400">
                                                <Clock className="w-4 h-4 mr-1.5" />
                                                {interview.duration}
                                            </div>
                                            <span className="text-xs text-indigo-400 font-medium">Video Call</span>
                                        </div>
                                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
                                            Join
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                                No upcoming interviews scheduled.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
