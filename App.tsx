
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Scraper } from './pages/Scraper';
import { Subscription } from './pages/Subscription';
import { Landing } from './pages/Landing';
import { AdminPanel } from './pages/AdminPanel';
import { ViewState, User } from './types';
import { Settings } from 'lucide-react';

const SettingsPage = () => (
  <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center h-full">
    <div className="bg-slate-800 p-6 rounded-full mb-4">
      <Settings size={48} className="text-indigo-500 animate-spin-slow" />
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
    <p>User profile and API configuration settings would go here.</p>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  
  // Initialize user from localStorage to persist login state
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('freightintel_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from local storage", error);
      return null;
    }
  });

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('freightintel_user', JSON.stringify(userData));
    // Always land on dashboard as requested, regardless of role
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('freightintel_user');
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleUpdateUsage = (count: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        recordsExtractedToday: user.recordsExtractedToday + count
      };
      setUser(updatedUser);
      localStorage.setItem('freightintel_user', JSON.stringify(updatedUser));
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'scraper':
        return <Scraper 
          user={user!} 
          onUpdateUsage={handleUpdateUsage}
          onUpgrade={() => setCurrentView('subscription')}
        />;
      case 'subscription':
        return <Subscription />;
      case 'settings':
        return <SettingsPage />;
      case 'admin':
        return user?.role === 'admin' ? <AdminPanel /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  if (!user) {
    return <Landing onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 ml-64 relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-20 h-screen overflow-hidden">
        {/* Top subtle gradient light effect */}
        <div className="absolute top-0 left-0 w-full h-96 bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full -translate-y-1/2"></div>
        
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
