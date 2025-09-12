import React from 'react';
import { useApp } from '../context/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import AlertSystem from './AlertSystem';
import Chatbot from './Chatbot';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { state } = useApp();

  return (
    <div className={`min-h-screen ${state.isDarkMode ? 'dark' : ''}`}>
      <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      <AlertSystem />
      <Chatbot />
    </div>
  );
}