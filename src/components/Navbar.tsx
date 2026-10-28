import React, { useState } from 'react';
import { Bot, GraduationCap, ShieldCheck, UserCheck, Menu, X, Search, PhoneCall, MapPin, Building2, ChevronDown, Check } from 'lucide-react';
import { CollegeInfo, User, Campus } from '../types';

interface NavbarProps {
  collegeInfo: CollegeInfo | null;
  campuses: Campus[];
  selectedCampus: string;
  onSelectCampus: (campusName: string) => void;
  currentUser: User | null;
  onOpenChat: () => void;
  onOpenEnquiry: () => void;
  onOpenTrackEnquiry: () => void;
  onOpenLogin: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  collegeInfo,
  campuses,
  selectedCampus,
  onSelectCampus,
  currentUser,
  onOpenChat,
  onOpenEnquiry,
  onOpenTrackEnquiry,
  onOpenLogin,
  onOpenAdmin,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [campusDropdownOpen, setCampusDropdownOpen] = useState(false);

  const collegeName = collegeInfo?.collegeName || 'Apex Institute of Technology & Science';

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeCampusObj = campuses.find(c => c.name === selectedCampus);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top micro-bar for emergency contact, NAAC badge and Campus Switcher */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Admissions Open 2026-27
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">NAAC A++ Accredited • NIRF Top 25</span>

            {/* Quick Campus Switcher in Top Bar */}
            <div className="relative">
              <button
                onClick={() => setCampusDropdownOpen(!campusDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white border border-slate-700 transition-colors text-[11px] font-semibold cursor-pointer"
              >
                <MapPin className="w-3 h-3 text-indigo-400" />
                <span>Campus: <strong className="text-white">{selectedCampus === 'All' ? 'All Campuses' : (activeCampusObj?.shortName || selectedCampus)}</strong></span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {campusDropdownOpen && (
                <div
                  className="absolute left-0 mt-1.5 w-72 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setCampusDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                    <span>Select Campus Location</span>
                    <Building2 className="w-3 h-3 text-indigo-600" />
                  </div>
                  <div className="py-1 space-y-1">
                    <button
                      onClick={() => {
                        onSelectCampus('All');
                        setCampusDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        selectedCampus === 'All' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div>All Campuses (Consolidated)</div>
                        <div className="text-[10px] font-normal text-slate-400">View all 3 campuses across Bangalore</div>
                      </div>
                      {selectedCampus === 'All' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>

                    {campuses.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onSelectCampus(c.name);
                          setCampusDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                          selectedCampus === c.name ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span>{c.name}</span>
                            {c.isMain && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-indigo-100 text-indigo-700">Main</span>
                            )}
                          </div>
                          <div className="text-[10px] font-normal text-slate-400">{c.city} • {c.areaAcres} Acres</div>
                        </div>
                        {selectedCampus === c.name && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300">
              <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
              Admissions Helpline: <strong className="text-white ml-1">{activeCampusObj?.phone || collegeInfo?.admissionPhone || '1800-200-APEX'}</strong>
            </span>
            <button
              onClick={onOpenTrackEnquiry}
              className="text-xs text-indigo-300 hover:text-indigo-100 underline decoration-indigo-400/50 cursor-pointer"
            >
              Track Enquiry Status
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <a href="#" className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight leading-none block hover:text-indigo-600 transition-colors">
                {collegeName}
              </a>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">Virtual Campus & AI Enquiry Portal</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-indigo-700 border border-slate-200 flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-indigo-500" />
                  {selectedCampus === 'All' ? 'All Campuses' : (activeCampusObj?.shortName || selectedCampus)}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <button onClick={() => scrollTo('hero')} className="hover:text-indigo-600 transition-colors cursor-pointer">
              Home
            </button>
            <button onClick={() => scrollTo('about')} className="hover:text-indigo-600 transition-colors cursor-pointer">
              About
            </button>
            <button onClick={() => scrollTo('courses')} className="hover:text-indigo-600 transition-colors cursor-pointer">
              Courses
            </button>
            <button onClick={() => scrollTo('admissions')} className="hover:text-indigo-600 transition-colors cursor-pointer">
              Admissions
            </button>
            <button onClick={() => scrollTo('facilities')} className="hover:text-indigo-600 transition-colors cursor-pointer">
              Facilities
            </button>
            <button onClick={() => scrollTo('contact')} className="hover:text-indigo-600 transition-colors cursor-pointer">
              Contact
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onOpenTrackEnquiry}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              Track Status
            </button>

            <button
              onClick={onOpenEnquiry}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all cursor-pointer shadow-xs"
            >
              Enquire Now
            </button>

            {/* Ask AI Pill Button */}
            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all transform active:scale-98 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-indigo-200 animate-bounce" />
              <span>Ask AI Chatbot</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </button>

            {/* Auth / Admin */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Panel
                </button>
                <button
                  onClick={onLogout}
                  className="text-xs text-slate-500 hover:text-rose-600 font-medium px-2 py-1 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-slate-500" />
                Staff Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm"
            >
              <Bot className="w-3.5 h-3.5" />
              Ask AI
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {/* Mobile Campus Selector */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>Campus Selection:</span>
            </span>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => onSelectCampus('All')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition-colors ${
                  selectedCampus === 'All' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                All Campuses
              </button>
              {campuses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectCampus(c.name)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition-colors truncate ${
                    selectedCampus === c.name ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  {c.shortName}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => scrollTo('hero')}
              className="text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              About College
            </button>
            <button
              onClick={() => scrollTo('courses')}
              className="text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Courses Offered
            </button>
            <button
              onClick={() => scrollTo('admissions')}
              className="text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Admissions 2026
            </button>
            <button
              onClick={() => scrollTo('facilities')}
              className="text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Campus Facilities
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Contact Directory
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEnquiry();
              }}
              className="w-full py-2.5 px-4 text-center rounded-xl bg-slate-900 text-white font-semibold text-sm"
            >
              Submit Official Enquiry
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrackEnquiry();
              }}
              className="w-full py-2 px-4 text-center rounded-xl border border-slate-200 text-slate-700 font-medium text-sm"
            >
              Track Enquiry by Reference Number
            </button>
            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2 px-4 text-center rounded-xl bg-indigo-50 text-indigo-700 font-bold text-sm"
              >
                Go to Admin Dashboard
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-2 px-4 text-center rounded-xl text-slate-600 font-medium text-sm hover:bg-slate-50"
              >
                Staff / Admin Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
