import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import InterviewDetail from './pages/InterviewDetail';
import NewInterview from './pages/NewInterview';
import Interviews from './pages/Interviews';
import ReasoningLab from './pages/ReasoningLab';
import Reports from './pages/Reports';
import ReportDetail from './pages/ReportDetail';

function App() {
  const AUTH_STORAGE_KEY = 'mv_is_authenticated';
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthenticated = useCallback(() => {
    setIsAuthenticated(true);
    window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  if (!isAuthenticated) {
    return <Login onAuthenticated={handleAuthenticated} />;
  }

  return (
    <Router>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-interview" element={<NewInterview />} />
          <Route path="/interview/:id" element={<InterviewDetail />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/reasoning-lab" element={<ReasoningLab />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/:id" element={<ReportDetail />} />
          <Route path="/settings" element={<div className="text-center py-20 text-gray-500">Settings (Coming Soon)</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
