import React from 'react';
import { Bot, Sparkles, ArrowRight, BookOpen, ShieldCheck, Award, Users, CheckCircle2, MapPin, Building2 } from 'lucide-react';
import { CollegeInfo, Campus } from '../types';

interface HeroProps {
  collegeInfo: CollegeInfo | null;
  campuses: Campus[];
  selectedCampus: string;
  onSelectCampus: (campusName: string) => void;
  onOpenChat: (initialPrompt?: string) => void;
  onExploreCourses: () => void;
  onOpenEnquiry: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  collegeInfo,
  campuses,
  selectedCampus,
  onSelectCampus,
  onOpenChat,
  onExploreCourses,
  onOpenEnquiry,
}) => {
  const activeCampusObj = campuses.find(c => c.name === selectedCampus);

  const quickQuestions = [
    'What courses does the college offer?',
    'What are the admission requirements?',
    'What is the fee structure?',
    'Are scholarships available?',
    'What are the placement opportunities?',
  ];

  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-indigo-300 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-violet-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        
        {/* Campus Selection Bar */}
        <div className="bg-white/80 backdrop-blur-sm p-2 sm:p-2.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 max-w-4xl mx-auto lg:mx-0">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 px-2">
            <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Select Campus:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
            <button
              onClick={() => onSelectCampus('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCampus === 'All'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              All Campuses ({campuses.length})
            </button>
            {campuses.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectCampus(c.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCampus === c.name
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3 h-3 opacity-70" />
                <span>{c.shortName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Campus Info Callout if specific campus is active */}
        {activeCampusObj && selectedCampus !== 'All' && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/70 text-indigo-900 text-xs font-medium animate-in fade-in">
            <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>
              <strong>{activeCampusObj.name}</strong> • {activeCampusObj.address} ({activeCampusObj.areaAcres} Acres)
            </span>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline and Call-to-actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-900 text-xs font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>24/7 AI-Powered Virtual College Counselor</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              <span className="text-indigo-700">Admissions 2026-27</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Your College, Your Questions, <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 bg-clip-text text-transparent">
                Instant Answers.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Explore courses, admissions, fees, placements, scholarships, and campus facilities across our multiple state-of-the-art campus locations with our AI assistant.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <button
                onClick={() => onOpenChat()}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 transition-all transform active:scale-98 cursor-pointer"
              >
                <Bot className="w-5 h-5 text-indigo-200" />
                <span>Start Chatting</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreCourses}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-xs hover:border-slate-400 transition-all cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Explore Courses</span>
              </button>

              <button
                onClick={onOpenEnquiry}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors cursor-pointer"
              >
                <span>Submit Form</span>
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="pt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Popular Student Questions:
              </p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => onOpenChat(q)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/80 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200/90 shadow-2xs transition-all cursor-pointer text-left"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <div className="text-2xl font-black text-indigo-600">3 Campuses</div>
                <div className="text-xs font-medium text-slate-500">Bangalore Tech Hubs</div>
              </div>
              <div>
                <div className="text-2xl font-black text-indigo-600">NAAC A++</div>
                <div className="text-xs font-medium text-slate-500">Highest Accreditation</div>
              </div>
              <div>
                <div className="text-2xl font-black text-indigo-600">94.2%</div>
                <div className="text-xs font-medium text-slate-500">Placement Record</div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Assistant Visual Interactive Showcase */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-3xl blur-lg opacity-25"></div>

              {/* Chat Simulation Card */}
              <div className="relative rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-sm">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 leading-none">Apex AI College Assistant</h2>
                      <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified Knowledge Base
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {activeCampusObj?.shortName || 'Multi-Campus'}
                  </span>
                </div>

                {/* Simulated Conversation */}
                <div className="space-y-3 text-xs">
                  {/* User bubble */}
                  <div className="flex justify-end">
                    <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-xs max-w-[85%] shadow-xs">
                      Which campus offers B.Tech in CSE and MBA?
                    </div>
                  </div>

                  {/* AI bubble */}
                  <div className="flex justify-start gap-2 items-start">
                    <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-slate-100 text-slate-800 p-3.5 rounded-2xl rounded-tl-xs max-w-[90%] space-y-2 border border-slate-200/60">
                      <p>
                        Based on verified campus program allocations:
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-slate-700">
                        <li><strong>B.Tech CSE:</strong> Main Campus (Tech Valley) & Green Hills Tech Campus (Electronic City).</li>
                        <li><strong>MBA & BCA:</strong> City Innovation Campus (Indiranagar) with specialized FinTech labs.</li>
                        <li><strong>Hostel:</strong> On-campus hostels available at Main & Green Hills campuses.</li>
                      </ul>
                      <div className="pt-1 flex items-center gap-1.5 text-[10px] text-indigo-700 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Source: Official Campus Directory & Course Allocation 2026-27</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive input trigger */}
                <div
                  onClick={() => onOpenChat()}
                  className="group flex items-center justify-between p-3 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-50 cursor-pointer transition-all"
                >
                  <span className="text-xs text-slate-500 group-hover:text-indigo-700 font-medium">
                    Ask about any campus, hostel fees, or cutoffs...
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold group-hover:bg-indigo-700 transition-colors">
                    Ask AI
                  </span>
                </div>

                {/* Features Highlights */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Multi-campus intelligence</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Real-time document RAG</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
