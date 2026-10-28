import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, ArrowUp, Sparkles, HelpCircle } from 'lucide-react';
import { api, tokenStorage } from './services/api';
import { CollegeInfo, Course, User, Campus } from './types';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { CoursesSection } from './components/CoursesSection';
import { AdmissionsSection } from './components/AdmissionsSection';
import { FacilitiesSection } from './components/FacilitiesSection';
import { EnquiryFormModal } from './components/EnquiryFormModal';
import { EnquiryStatusModal } from './components/EnquiryStatusModal';
import { LoginModal } from './components/LoginModal';
import { Chatbot } from './components/Chatbot';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

export default function App() {
  const [collegeInfo, setCollegeInfo] = useState<CollegeInfo | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<string>('All');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // View state
  const [isAdminView, setIsAdminView] = useState(false);

  // Modals & Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatPrompt, setChatPrompt] = useState<string | undefined>(undefined);

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryCourse, setEnquiryCourse] = useState<string>('');

  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [trackRef, setTrackRef] = useState<string>('');

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [showScrollTop, setShowScrollTop] = useState(false);

  // Initial load & Auth verification
  useEffect(() => {
    async function init() {
      try {
        const [infoRes, coursesRes, campusesRes] = await Promise.all([
          api.getCollegeProfile(),
          api.getCourses(),
          api.getCampuses(),
        ]);
        setCollegeInfo(infoRes.data);
        setCourses(coursesRes.data);
        setCampuses(campusesRes.data);
      } catch (err) {
        console.error('Failed to load initial college data:', err);
      }

      // Check existing auth token
      const token = tokenStorage.get();
      if (token) {
        try {
          const userRes = await api.getCurrentUser();
          setCurrentUser(userRes.user);
        } catch (e) {
          tokenStorage.clear();
          setCurrentUser(null);
        }
      }

      setLoading(false);
    }

    init();

    // Scroll listener for back-to-top
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // ignore
    }
    tokenStorage.clear();
    setCurrentUser(null);
    setIsAdminView(false);
  };

  const handleOpenChatWithPrompt = (prompt?: string) => {
    if (prompt) {
      setChatPrompt(prompt);
    }
    setIsChatOpen(true);
  };

  const handleOpenEnquiryForCourse = (courseName: string) => {
    setEnquiryCourse(courseName);
    setIsEnquiryOpen(true);
  };

  const handleTrackSubmittedEnquiry = (ref: string) => {
    setTrackRef(ref);
    setIsTrackOpen(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center animate-bounce shadow-lg shadow-indigo-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div className="font-extrabold text-slate-800 text-base">CampusQuery AI</div>
          <div className="text-xs text-slate-400">Loading College Knowledge Portal...</div>
        </div>
      </div>
    );
  }

  // If in Admin Dashboard mode and user is authenticated
  if (isAdminView && currentUser) {
    return (
      <AdminDashboard
        currentUser={currentUser}
        onLogout={handleLogout}
        onBackToWebsite={() => setIsAdminView(false)}
        onCollegeInfoUpdated={(updated) => setCollegeInfo(updated)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-600 selection:text-white">
      {/* Navigation */}
      <Navbar
        collegeInfo={collegeInfo}
        campuses={campuses}
        selectedCampus={selectedCampus}
        onSelectCampus={setSelectedCampus}
        currentUser={currentUser}
        onOpenChat={() => handleOpenChatWithPrompt()}
        onOpenEnquiry={() => {
          setEnquiryCourse('');
          setIsEnquiryOpen(true);
        }}
        onOpenTrackEnquiry={() => {
          setTrackRef('');
          setIsTrackOpen(true);
        }}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAdmin={() => setIsAdminView(true)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero */}
        <Hero
          collegeInfo={collegeInfo}
          campuses={campuses}
          selectedCampus={selectedCampus}
          onSelectCampus={setSelectedCampus}
          onOpenChat={handleOpenChatWithPrompt}
          onExploreCourses={() => {
            const el = document.getElementById('courses');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenEnquiry={() => {
            setEnquiryCourse('');
            setIsEnquiryOpen(true);
          }}
        />

        {/* About College */}
        <AboutSection
          collegeInfo={collegeInfo}
          onOpenEnquiry={() => {
            setEnquiryCourse('');
            setIsEnquiryOpen(true);
          }}
        />

        {/* Courses Offered */}
        <CoursesSection
          courses={courses}
          campuses={campuses}
          selectedCampus={selectedCampus}
          onSelectCampus={setSelectedCampus}
          onOpenChatWithCourse={(cName) => handleOpenChatWithPrompt(`Tell me all details about ${cName}, including eligibility, fees, syllabus, and placement prospects.`)}
          onOpenEnquiryForCourse={handleOpenEnquiryForCourse}
        />

        {/* Admissions Process & Deadlines */}
        <AdmissionsSection
          collegeInfo={collegeInfo}
          onOpenEnquiry={() => {
            setEnquiryCourse('');
            setIsEnquiryOpen(true);
          }}
          onOpenChatWithTopic={handleOpenChatWithPrompt}
        />

        {/* Facilities & Campus Life */}
        <FacilitiesSection
          onOpenChatWithTopic={handleOpenChatWithPrompt}
        />
      </main>

      {/* Footer */}
      <Footer
        collegeInfo={collegeInfo}
        onOpenChat={() => handleOpenChatWithPrompt()}
        onOpenEnquiry={() => {
          setEnquiryCourse('');
          setIsEnquiryOpen(true);
        }}
        onOpenTrackEnquiry={() => {
          setTrackRef('');
          setIsTrackOpen(true);
        }}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Persistent Floating Chat Trigger (When Chat window is closed) */}
      {!isChatOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          {/* Subtle bubble cue */}
          <div
            onClick={() => handleOpenChatWithPrompt()}
            className="hidden sm:flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl shadow-lg border border-slate-200 text-xs font-semibold text-slate-800 cursor-pointer hover:border-indigo-300 transition-all hover:scale-102"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Have questions? Ask AI Counselor</span>
          </div>

          <button
            onClick={() => handleOpenChatWithPrompt()}
            className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white flex items-center justify-center shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            aria-label="Open AI College Enquiry Assistant"
          >
            <Bot className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
            </span>
          </button>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-30 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-md flex items-center justify-center transition-all cursor-pointer"
          title="Scroll to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* AI Chatbot Dialog / Drawer */}
      <Chatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        collegeInfo={collegeInfo}
        campuses={campuses}
        selectedCampus={selectedCampus}
        onSelectCampus={setSelectedCampus}
        onOpenEnquiry={() => {
          setIsChatOpen(false);
          setEnquiryCourse('');
          setIsEnquiryOpen(true);
        }}
        externalPrompt={chatPrompt}
        onClearExternalPrompt={() => setChatPrompt(undefined)}
      />

      {/* Enquiry Form Modal */}
      <EnquiryFormModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        courses={courses}
        campuses={campuses}
        selectedCampus={selectedCampus}
        initialCourse={enquiryCourse}
        onTrackSubmittedRef={handleTrackSubmittedEnquiry}
      />

      {/* Enquiry Status Tracker Modal */}
      <EnquiryStatusModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
        initialRef={trackRef}
      />

      {/* Staff Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAdminView(true);
        }}
      />
    </div>
  );
}
