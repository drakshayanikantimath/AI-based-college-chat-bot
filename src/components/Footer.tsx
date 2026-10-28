import React, { useState } from 'react';
import { GraduationCap, MapPin, Phone, Mail, Globe, Shield, ExternalLink, X } from 'lucide-react';
import { CollegeInfo } from '../types';

interface FooterProps {
  collegeInfo: CollegeInfo | null;
  onOpenChat: () => void;
  onOpenEnquiry: () => void;
  onOpenTrackEnquiry: () => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  collegeInfo,
  onOpenChat,
  onOpenEnquiry,
  onOpenTrackEnquiry,
  onOpenLogin,
}) => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  const collegeName = collegeInfo?.collegeName || 'Apex Institute of Technology & Science';

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Brand & Description (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-black text-lg text-white tracking-tight">{collegeName}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {collegeInfo?.description || 'A premier higher education institution dedicated to technology, science, and managerial excellence.'}
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">NAAC A++ Grade</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">NBA Accredited</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">NIRF Ranked</span>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => scrollTo('hero')} className="hover:text-white transition-colors cursor-pointer">Campus Home</button></li>
              <li><button onClick={() => scrollTo('about')} className="hover:text-white transition-colors cursor-pointer">About College</button></li>
              <li><button onClick={() => scrollTo('courses')} className="hover:text-white transition-colors cursor-pointer">Degree Programs</button></li>
              <li><button onClick={() => scrollTo('admissions')} className="hover:text-white transition-colors cursor-pointer">Admissions 2026</button></li>
              <li><button onClick={() => scrollTo('facilities')} className="hover:text-white transition-colors cursor-pointer">Campus Facilities</button></li>
            </ul>
          </div>

          {/* Col 3: Student Tools (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Student & Enquiry Tools</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={onOpenChat} className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer">✦ 24/7 AI Chatbot Assistant</button></li>
              <li><button onClick={onOpenEnquiry} className="hover:text-white transition-colors cursor-pointer">Submit Admission Enquiry</button></li>
              <li><button onClick={onOpenTrackEnquiry} className="hover:text-white transition-colors cursor-pointer">Track Enquiry Status (Ref #)</button></li>
              <li><button onClick={() => setModalType('privacy')} className="hover:text-white transition-colors cursor-pointer">Student Data Privacy Notice</button></li>
              <li><button onClick={onOpenLogin} className="hover:text-white transition-colors cursor-pointer">Staff & Admin Login</button></li>
            </ul>
          </div>

          {/* Col 4: Official Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Official Contacts</h4>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>{collegeInfo?.address}, {collegeInfo?.city}, {collegeInfo?.state} - {collegeInfo?.pincode}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{collegeInfo?.phone || '+91 (080) 4567-8900'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{collegeInfo?.email || 'info@apexinstitute.edu'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{collegeInfo?.website || 'https://apexinstitute.edu'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} {collegeName}. All Rights Reserved.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setModalType('privacy')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Privacy Notice
            </button>
            <button onClick={() => setModalType('terms')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Terms & Conditions
            </button>
            <button onClick={onOpenLogin} className="hover:text-indigo-400 transition-colors cursor-pointer">
              Admin Portal
            </button>
          </div>
        </div>

      </div>

      {/* Privacy / Terms Info Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white text-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[85vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900">
              {modalType === 'privacy' ? 'Student Privacy & Data Protection Notice' : 'Campus Portal Terms & Conditions'}
            </h3>

            {modalType === 'privacy' ? (
              <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                <p>
                  <strong>1. Data Collection:</strong> We collect contact details (Name, Email, Mobile Number, Program of Interest) solely to respond to academic enquiries and communicate admission guidelines.
                </p>
                <p>
                  <strong>2. AI Chatbot Logs:</strong> Anonymous conversational queries are analyzed to enrich our verified knowledge base and resolve common student questions. Personal phone numbers or emails entered in chat are neither sold nor shared with third-party advertisers.
                </p>
                <p>
                  <strong>3. Grounded RAG Answers:</strong> Chat answers are retrieved strictly from verified college source documents to ensure transparency and prevent fabricated deadlines or fees.
                </p>
              </div>
            ) : (
              <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                <p>
                  <strong>1. Informational Purpose:</strong> Information provided through this assistant reflects current college guidelines and curricula. Final seat allotments and fee confirmations are subject to official university counseling.
                </p>
                <p>
                  <strong>2. Deadlines:</strong> Published deadlines are valid for the 2026-27 admission cycle. Always confirm late submissions with the Admissions Registrar office.
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
