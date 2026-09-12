import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { AppProvider } from './context/AppContext';
import { ResumeProvider } from './context/ResumeContext';
import { MainLayout } from './components/layout/MainLayout';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Resume } from './pages/Resume';
import { Skills } from './pages/Skills';
import { Learning } from './pages/Learning';
import { Quiz } from './pages/Quiz';
import { Interview } from './pages/Interview';
import { Performance } from './pages/Performance';
import { Jobs } from './pages/Jobs';
import { Progress } from './pages/Progress';
import { NotFound } from './pages/NotFound';

import './styles/globals.css';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <AppProvider>
            <ResumeProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={<ProtectedLayout />} />
              </Routes>
            </ResumeProvider>
          </AppProvider>
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
