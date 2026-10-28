import React from 'react';
import { Target, Compass, Award, MapPin, Building2, Phone, Mail, Globe, CheckCircle } from 'lucide-react';
import { CollegeInfo } from '../types';

interface AboutSectionProps {
  collegeInfo: CollegeInfo | null;
  onOpenEnquiry: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ collegeInfo, onOpenEnquiry }) => {
  if (!collegeInfo) return null;

  return (
    <section id="about" className="py-20 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Legacy & Heritage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About {collegeInfo.collegeName}
          </h2>
          <p className="text-base text-slate-600">
            {collegeInfo.tagline}
          </p>
        </div>

        {/* Overview Box */}
        <div className="grid lg:grid-cols-12 gap-8 items-center bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/80">
          <div className="lg:col-span-7 space-y-5">
            <h3 className="text-2xl font-bold text-slate-900">
              Shaping Future Global Leaders in Technology, Science & Management
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {collegeInfo.description}
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              {collegeInfo.accreditation.map((acc, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                >
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  {acc}
                </span>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-6 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{collegeInfo.city}, {collegeInfo.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Est. {collegeInfo.establishedYear}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-semibold text-indigo-900">{collegeInfo.ranking}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            {/* Vision Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-slate-900">Our Vision</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {collegeInfo.vision}
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-slate-900">Our Mission</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {collegeInfo.mission}
              </p>
            </div>
          </div>
        </div>

        {/* Accreditations and Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center">
            <div className="text-3xl font-black text-indigo-600 mb-1">28+</div>
            <div className="text-xs font-semibold text-slate-700">Years of Academic Excellence</div>
          </div>
          <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center">
            <div className="text-3xl font-black text-indigo-600 mb-1">15,000+</div>
            <div className="text-xs font-semibold text-slate-700">Alumni Worldwide</div>
          </div>
          <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center">
            <div className="text-3xl font-black text-indigo-600 mb-1">120+</div>
            <div className="text-xs font-semibold text-slate-700">Ph.D. Research Faculty</div>
          </div>
          <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center">
            <div className="text-3xl font-black text-indigo-600 mb-1">50+</div>
            <div className="text-xs font-semibold text-slate-700">Global Patents & MoUs</div>
          </div>
        </div>

      </div>
    </section>
  );
};
