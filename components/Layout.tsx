
import React from 'react';
import { ToolType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: ToolType;
  setActiveTab: (tab: ToolType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: ToolType.DASHBOARD, label: 'Inicio', icon: '🏠' },
    { id: ToolType.LIVE, label: 'Live', icon: '🎙️' },
    { id: ToolType.IMAGE, label: 'Editor', icon: '🎨' },
    { id: ToolType.TEXT, label: 'AI', icon: '✍️' },
    { id: ToolType.AUDIO, label: 'Voz', icon: '🔊' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 pb-20 md:pb-0">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-64 bg-white border-r border-slate-200 p-4 sticky top-0 h-screen flex-col z-20">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <span className="text-2xl">✨</span> Gemini Studio
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Workspace Pro</p>
        </div>
        
        <div className="space-y-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-8 px-2 space-y-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3">
            <p className="text-[10px] font-bold text-indigo-600 mb-1">PRO TIP</p>
            <p className="text-[11px] text-indigo-800 leading-tight">Usa "Live Talk" para lluvia de ideas rápida.</p>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-30">
        <h1 className="text-lg font-bold text-indigo-600 flex items-center gap-2">
          <span className="text-xl">✨</span> Gemini Studio
        </h1>
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
          PRO
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 flex justify-around items-center p-2 z-40 safe-area-bottom">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
              activeTab === item.id
                ? 'text-indigo-600 scale-110'
                : 'text-slate-400'
            }`}
          >
            <span className="text-xl mb-0.5">{item.icon}</span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
