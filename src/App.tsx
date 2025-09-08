import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

type AppState = 'landing' | 'auth' | 'dashboard';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppState>('landing');
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading TIMS...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show dashboard
  if (user) {
    return (
      <InventoryProvider>
        <Dashboard />
      </InventoryProvider>
    );
  }

  // Show appropriate page based on current state
  switch (currentPage) {
    case 'landing':
      return <LandingPage onGetStarted={() => setCurrentPage('auth')} />;
    case 'auth':
      return (
        <AuthPage
          onBack={() => setCurrentPage('landing')}
          onSuccess={() => setCurrentPage('dashboard')}
        />
      );
    default:
      return <LandingPage onGetStarted={() => setCurrentPage('auth')} />;
  }
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;