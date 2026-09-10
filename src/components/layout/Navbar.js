import React from 'react';
import { ShieldAlert, Sparkles, Server, Home, LayoutDashboard, AlertTriangle, BarChart3, Calendar, Newspaper, History, Globe } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, serverStatus }) {
  const navItems = [
    { id: 'landing', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'hub', label: 'Dashboard Hub', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'alerts', label: 'Risk Alerts', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'weather', label: 'City Controls', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics & Charts', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'forecast', label: '24h Forecast', icon: <Calendar className="w-4 h-4" /> },
    { id: 'news', label: 'Weather News', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'history', label: 'Audit Log', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActivePage('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="p-2.5 gradient-bg-palette rounded-2xl shadow-md text-white group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  HydroWatch<span className="gradient-text-palette">AI</span>
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-purple-100 text-palette-magenta border border-purple-200 rounded-full">
                  Light OS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold hidden sm:block">
                Urban Flood Forecasting & Alert System
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`px-3 py-2 text-xs font-extrabold rounded-xl flex items-center space-x-1.5 transition-all ${
                  activePage === item.id
                    ? 'gradient-bg-palette text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Engine Status Badge */}
          <div className="flex items-center space-x-2 bg-slate-50 px-3.5 py-1.5 rounded-2xl border border-slate-200 shadow-xs text-xs font-bold">
            {serverStatus === 'online' ? (
              <>
                <Server className="w-3.5 h-3.5 text-palette-pink" />
                <span className="inline-flex items-center space-x-1.5 text-emerald-800 font-black">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="hidden sm:inline">Flask API (Connected)</span>
                  <span className="sm:hidden">API</span>
                </span>
              </>
            ) : (
              <>
                <Globe className="w-3.5 h-3.5 text-palette-magenta" />
                <span className="inline-flex items-center space-x-1.5 text-palette-magenta font-black">
                  <span className="w-2 h-2 rounded-full bg-palette-pink animate-pulse"></span>
                  <span className="hidden sm:inline">Cloud Engine (Active)</span>
                  <span className="sm:hidden">Cloud</span>
                </span>
              </>
            )}
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-slate-100 space-x-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`px-3 py-1.5 text-[11px] font-extrabold rounded-xl flex items-center space-x-1 whitespace-nowrap transition-all ${
                activePage === item.id
                  ? 'gradient-bg-palette text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

      </div>
    </header>
  );
}
