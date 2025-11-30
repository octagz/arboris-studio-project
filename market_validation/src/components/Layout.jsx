import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, PlusCircle, Brain } from 'lucide-react';

const Layout = ({ children, onLogout }) => {
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Interviews', path: '/interviews' },
        { icon: Brain, label: 'Reasoning Lab', path: '/reasoning-lab' },
        { icon: FileText, label: 'Reports', path: '/reports' },
    ];

    return (
        <div className="flex h-screen bg-slate-950 text-slate-50 font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col shadow-sm z-10">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-tight">
                                InsightStream
                            </h1>
                            <p className="text-xs text-slate-400 font-medium">Market Validation</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-indigo-500/10 text-indigo-400 shadow-sm ring-1 ring-indigo-500/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Link to="/new-interview" className="w-full flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/40 transform hover:-translate-y-0.5">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        New Interview
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-slate-950">
                {/* Top Header (Optional, for breadcrumbs or user profile) */}
                <header className="bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="text-sm breadcrumbs text-slate-500">
                        {/* Placeholder for breadcrumbs */}
                        <span className="font-medium text-slate-200">Application</span> / {navItems.find(i => i.path === location.pathname)?.label || 'Page'}
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onLogout}
                            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                        >
                            Log out
                        </button>
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                            JD
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
