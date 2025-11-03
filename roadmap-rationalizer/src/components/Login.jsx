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
    <div className="min-h-screen bg-satin flex items-center justify-center px-4 text-fog">
      <div className="w-full max-w-md">
        <div className="card-elevated p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl branch-depth bg-[linear-gradient(145deg,#1A8A74,#0F6B5C)] flex items-center justify-center">
              <svg className="w-10 h-10 text-gold-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4s-3 1.567-3 3.5S10.343 11 12 11zM5.5 20a6.5 6.5 0 0113 0" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display gold-type">Private Access</h1>
              <p className="text-seafoam text-sm">
                Enter the credentials provided by the project owner to continue.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-xs font-semibold text-muted uppercase tracking-[0.2em]">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                className="w-full input-emerald text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="login-password" className="text-xs font-semibold text-muted uppercase tracking-[0.2em]">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                className="w-full input-emerald text-sm"
              />
            </div>

            <button
              type="submit"
              className="btn-emerald w-full justify-center"
              disabled={!isConfigured}
            >
              Sign In
            </button>
          </form>

          {error && (
            <div className="rounded-lg border border-[rgba(213,75,75,0.55)] bg-[rgba(213,75,75,0.18)] px-4 py-3 text-sm text-error">
              {error}
            </div>
          )}

          {!isConfigured && (
            <p className="text-xs text-gold-base text-center font-semibold">
              Environment variables <code>VITE_LOGIN_EMAIL</code> and <code>VITE_LOGIN_PASSWORD</code> must be set before building the site.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;

