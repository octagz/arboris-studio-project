import { useState } from 'react';

function Login({ onAuthenticated }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const loginEmail = import.meta.env.VITE_LOGIN_EMAIL;
    const loginPassword = import.meta.env.VITE_LOGIN_PASSWORD;
    const isConfigured = Boolean(loginEmail && loginPassword);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!isConfigured) {
            setError('Login is not configured. Please contact the site owner.');
            return;
        }

        if (email.trim() === loginEmail && password === loginPassword) {
            setError('');
            onAuthenticated();
            return;
        }

        setError('Incorrect email or password.');
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 text-slate-50">
            <div className="w-full max-w-md">
                <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-8 space-y-6">
                    <div className="text-center space-y-3">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4s-3 1.567-3 3.5S10.343 11 12 11zM5.5 20a6.5 6.5 0 0113 0" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Private Access</h1>
                            <p className="text-slate-400 text-sm">
                                Enter the credentials provided by the project owner to continue.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="login-email" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Email
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                autoComplete="email"
                                required
                                className="w-full bg-slate-950 border border-slate-700 text-slate-50 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 placeholder-slate-500"
                                placeholder="name@company.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="login-password" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Password
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                autoComplete="current-password"
                                required
                                className="w-full bg-slate-950 border border-slate-700 text-slate-50 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 placeholder-slate-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/20 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all shadow-lg shadow-indigo-900/20"
                            disabled={!isConfigured}
                        >
                            Sign In
                        </button>
                    </form>

                    {error && (
                        <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {!isConfigured && (
                        <p className="text-xs text-yellow-500 text-center font-semibold">
                            Environment variables <code>VITE_LOGIN_EMAIL</code> and <code>VITE_LOGIN_PASSWORD</code> must be set.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
