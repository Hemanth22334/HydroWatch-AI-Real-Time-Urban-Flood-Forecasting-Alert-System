import React from 'react';
import { ArrowRight, Sparkles, Activity, Globe, Calendar, Newspaper } from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  const highlights = [
    {
      icon: <Activity className="w-6 h-6 text-palette-pink" />,
      title: "Random Forest ML Engine",
      desc: "Evaluates precipitation, river stage, and atmospheric humidity to calculate flood probability percentages."
    },
    {
      icon: <Globe className="w-6 h-6 text-amber-600" />,
      title: "Live Global City Weather",
      desc: "Fetch real-time telemetry for any city worldwide (Mumbai, London, New York, Tokyo) without API keys."
    },
    {
      icon: <Calendar className="w-6 h-6 text-palette-magenta" />,
      title: "24-Hour Future Forecast",
      desc: "Predictive hourly timeline pinpointing peak flood risk windows and hydrological danger periods."
    },
    {
      icon: <Newspaper className="w-6 h-6 text-palette-indigo" />,
      title: "City Weather News Bulletins",
      desc: "Localized meteorological news feeds, river watches, and disaster management advisories with imagery."
    }
  ];

  return (
    <div className="space-y-16 py-6 md:py-12">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-8 md:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-palette-indigo/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-palette-pink/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 shadow-sm text-xs font-black text-palette-magenta">
            <Sparkles className="w-4 h-4 text-palette-pink animate-spin" />
            <span>AI-POWERED HYDROLOGICAL INTELLIGENCE PLATFORM</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Real-Time Urban Flood Forecasting & <span className="gradient-text-palette">Alert System</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Protecting urban communities with Machine Learning predictions, live global meteorological telemetry, 24-hour future timelines, and instant visual risk warnings.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl gradient-bg-palette text-white font-black text-base shadow-xl flex items-center justify-center space-x-3 transition-all hover:scale-105 active:scale-95 group"
            >
              <span>Explore Dashboard Hub</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-100 text-left">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-2xl font-black text-slate-900">100 Trees</div>
              <div className="text-xs text-slate-500 font-bold">Random Forest ML</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-2xl font-black text-palette-pink">&lt; 50 ms</div>
              <div className="text-xs text-slate-500 font-bold">Inference Speed</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-2xl font-black text-palette-magenta">Global</div>
              <div className="text-xs text-slate-500 font-bold">City Geocoding</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-2xl font-black text-amber-600">24 Hours</div>
              <div className="text-xs text-slate-500 font-bold">Future Forecast</div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURE HIGHLIGHTS GRID */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-slate-900">Platform Features & Architecture</h2>
          <p className="text-sm text-slate-600 font-semibold">
            Engineered for disaster management authorities, municipal planners, and urban residents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((h, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg flex flex-col justify-between hover:border-palette-magenta/50 transition-all hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 w-max shadow-sm">
                  {h.icon}
                </div>
                <h3 className="text-lg font-black text-slate-900">{h.title}</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {h.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FOOTER CARD */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-8 md:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-black">Ready to inspect real-time flood predictions?</h3>
          <p className="text-xs md:text-sm text-slate-300 font-medium">
            Access live parameter controls, interactive charts, 24-hour timelines, and city weather news.
          </p>
        </div>
        <button
          onClick={onGetStarted}
          className="px-8 py-4 rounded-2xl gradient-bg-palette text-white font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex-shrink-0"
        >
          Launch Dashboard Hub Now
        </button>
      </section>

    </div>
  );
}
