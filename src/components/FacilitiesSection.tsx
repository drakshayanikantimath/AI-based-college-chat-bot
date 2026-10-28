import React, { useState } from 'react';
import {
  BookOpen,
  Cpu,
  Home,
  Bus,
  Trophy,
  Coffee,
  Wifi,
  HeartPulse,
  Users,
  CheckCircle2,
  Bot
} from 'lucide-react';

interface FacilitiesSectionProps {
  onOpenChatWithTopic: (topic: string) => void;
}

export const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({ onOpenChatWithTopic }) => {
  const [activeTab, setActiveTab] = useState<string>('hostel');

  const facilities = [
    {
      id: 'hostel',
      icon: Home,
      title: 'Hostels & Residential Living',
      badge: 'Separate Boys & Girls Hostels',
      summary: 'Safe, fully furnished on-campus accommodation with 24/7 biometric security and nutritious dining.',
      details: [
        'Twin Sharing (attached bath) @ ₹1,15,000/yr; Triple Sharing @ ₹85,000/yr (includes 4 daily meals)',
        '24/7 resident wardens, CCTV surveillance, and access control',
        'High-speed Wi-Fi throughout all rooms and study corridors',
        'Solar powered hot water, mechanized laundry, and indoor recreational lounges',
      ],
      aiPrompt: 'What is the hostel fee structure and what facilities are included?',
    },
    {
      id: 'labs',
      icon: Cpu,
      title: 'Hi-Tech Laboratories & Innovation Hub',
      badge: 'Nvidia RTX GPU Clusters',
      summary: 'Over 12 dedicated advanced research centers equipped with enterprise-grade equipment.',
      details: [
        'Artificial Intelligence & High-Performance Computing Cluster with Nvidia GPUs',
        'Cadence & Synopsys VLSI Design EDA Suites',
        'Apple iOS & Multimedia Development Mac Center',
        'MakerSpace FabLab with 3D printers, CNC laser cutters, and IoT development kits',
      ],
      aiPrompt: 'What computing and laboratory facilities does the college offer?',
    },
    {
      id: 'library',
      icon: BookOpen,
      title: 'Central Digital Library',
      badge: '65,000+ Print Volumes & IEEE Xplore',
      summary: 'Air-conditioned multidisciplinary knowledge hub open 24/7 during exam weeks.',
      details: [
        'Digital subscriptions: IEEE Xplore, ScienceDirect, ACM, Springer, J-GATE',
        '300+ seat quiet study halls with ergonomic seating and power plugs',
        'Automated RFID book lending kiosk and self-service return dropboxes',
        'Dedicated research scholar cubicles and media presentation rooms',
      ],
      aiPrompt: 'What are the library timings and digital journal subscriptions?',
    },
    {
      id: 'transport',
      icon: Bus,
      title: 'AC Campus Fleet & Transit',
      badge: '35 AC Buses with Live GPS Tracking',
      summary: 'Safe, punctual door-to-hub transportation across 28 metropolitan routes.',
      details: [
        'Annual transit fee ranges between ₹28,000 and ₹36,000 based on destination zone',
        'Live tracking and ETA updates via the college mobile app for parents and students',
        'Experienced, background-verified drivers and dedicated speed-governed fleet',
        'Direct connection to major metro stations and railway transit terminals',
      ],
      aiPrompt: 'What is the bus transportation fee and what routes are covered?',
    },
    {
      id: 'sports',
      icon: Trophy,
      title: 'Sports Arena & Fitness Center',
      badge: 'Olympic-Standard Synthetic Track',
      summary: 'Comprehensive athletic facilities promoting physical fitness and collegiate sports.',
      details: [
        'Full-size floodlit football/cricket ground with turf pitch',
        'Two international standard synthetic basketball courts and volleyball arena',
        'Air-conditioned gymnasium with certified fitness trainers and aerobics zone',
        'Indoor courts for badminton, table tennis, chess, and carrom',
      ],
      aiPrompt: 'Are sports facilities and gymnasiums free for students?',
    },
    {
      id: 'health',
      icon: HeartPulse,
      title: 'Medical Center & Wellbeing',
      badge: '24/7 Resident Doctor & Ambulance',
      summary: 'Complete on-campus primary healthcare and psychological counseling center.',
      details: [
        'Round-the-clock emergency care with on-campus ICU ambulance support',
        'Consultation room, 6-bed observation ward, and basic emergency medicines',
        'Licensed mental health and student guidance counselor available on appointment',
        'Annual comprehensive medical checkup for all incoming students',
      ],
      aiPrompt: 'What medical facilities are available on campus in emergencies?',
    },
  ];

  const current = facilities.find(f => f.id === activeTab) || facilities[0];

  return (
    <section id="facilities" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Campus Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            World-Class Facilities Designed for Student Success
          </h2>
          <p className="text-base text-slate-600">
            Experience an inspiring 40-acre green campus equipped with modern technology, comfortable living, and holistic student amenities.
          </p>
        </div>

        {/* Tab navigation pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          {facilities.map((fac) => {
            const Icon = fac.icon;
            const isSelected = activeTab === fac.id;
            return (
              <button
                key={fac.id}
                onClick={() => setActiveTab(fac.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
                <span>{fac.title.split('&')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Facility Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                {current.badge}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {current.title}
            </h3>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {current.summary}
            </p>

            {/* Bullet Highlights */}
            <div className="space-y-3 pt-2">
              {current.details.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenChatWithTopic(current.aiPrompt)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Ask AI About {current.title.split('&')[0]}</span>
              </button>
            </div>
          </div>

          {/* Quick Stats side card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 space-y-5">
            <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Campus Snapshot</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs text-slate-400">Campus Area</span>
                <span className="text-xs font-bold text-white">40+ Acres Eco-Friendly Campus</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs text-slate-400">Internet Speed</span>
                <span className="text-xs font-bold text-emerald-400">1 Gbps High-Speed Wi-Fi</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs text-slate-400">Hostel Capacity</span>
                <span className="text-xs font-bold text-white">900+ Students (Separate Wings)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Security & Surveillance</span>
                <span className="text-xs font-bold text-white">24/7 CCTV & Security Guards</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-[11px] text-slate-400 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                💡 Want to take an in-person guided tour? Visit the main reception desk any working day between 11:00 AM & 3:00 PM.
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
