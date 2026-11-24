import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import { getSettings, saveSettings } from './utils/settingsStorage';
import './styles/global.css';
import './styles/typing.css';
import './styles/dashboard.css';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [settings, setSettings] = useState(getSettings());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  if (currentView === 'landing') {
    return <Landing onStart={() => setCurrentView('home')} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home settings={settings} onBack={() => setCurrentView('landing')} />;
      case 'dashboard': return <Dashboard />;
      case 'statistics': return <Statistics />;
      case 'settings': return <Settings settings={settings} updateSettings={updateSettings} />;
      default: return <Home settings={settings} onBack={() => setCurrentView('landing')} />;
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}