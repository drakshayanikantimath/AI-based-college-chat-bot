import React from 'react';
import { Calendar, FileCheck, CheckCircle2, AlertCircle, Phone, Mail, ArrowRight, HelpCircle } from 'lucide-react';
import { CollegeInfo } from '../types';

interface AdmissionsSectionProps {
  collegeInfo: CollegeInfo | null;
  onOpenEnquiry: () => void;
  onOpenChatWithTopic: (topic: string) => void;
}

export const AdmissionsSection: React.FC<AdmissionsSectionProps> = ({
  collegeInfo,
  onOpenEnquiry,
  onOpenChatWithTopic,
}) => {
  const steps = [
    {
      step: '01',
      title: 'Online Application',
      desc: 'Submit the application form online or visit the campus admissions office with academic credentials and photo ID.',
    },
    {
      step: '02',
      title: 'Entrance Score & Merit Review',
      desc: 'Applications are screened against verified entrance scores (JEE Main / State CET / CAT / Institute Merit).',
    },
    {
      step: '03',
      title: 'Document Verification',
      desc: 'Attend original document verification in person or virtually with our admissions counselors.',
    },
    {
      step: '04',
      title: 'Seat Allotment & Enrollment',
      desc: 'Receive formal admission offer letter, pay the initial semester installment, and confirm seat booking.',
    },
  ];

  const deadlines = [
    { event: 'Application Portal Opens', date: 'May 1, 2026', status: 'Upcoming' },
    { event: 'Early Merit Scholarship Deadline', date: 'June 15, 2026', status: 'Upcoming' },
    { event: 'Regular Application Cutoff', date: 'June 30, 2026', status: 'Mandatory' },
    { event: 'Counselling & Verification Phase', date: 'July 5 – July 15, 2026', status: 'Scheduled' },
    { event: 'Orientation & Class Commencement', date: 'August 3, 2026', status: 'Academic Session' },
  ];

  const documents = [
    'Class 10th Secondary School Certificate (DOB Proof)',
    'Class 12th / Pre-University Mark Sheet (Original + 3 copies)',
    'Qualifying Entrance Exam Scorecard (JEE Main / CET / GATE / CAT)',
    'Transfer Certificate (TC) & Migration Certificate',
    'Character / Conduct Certificate from institution last attended',
    'Category / EWS / Income Certificate (if claiming quota / aid)',
    'Government Photo ID (Aadhaar Card or Passport)',
    '6 Recent colored passport-size photographs',
  ];

  return (
    <section id="admissions" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Admissions Desk 2026-27
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Transparent, Merit-Driven Admission Process
          </h2>
          <p className="text-base text-slate-600">
            All schedules, cutoff thresholds, and required documentation are verified directly against official university guidelines.
          </p>
        </div>

        {/* 4 Steps Roadmap */}
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-slate-50 p-6 rounded-2xl border border-slate-200/90 relative group hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="text-4xl font-black text-indigo-200 group-hover:text-indigo-600 transition-colors mb-3">
                {s.step}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* 2-Columns: Deadlines & Required Documents */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Deadlines Schedule */}
          <div className="lg:col-span-6 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Official Academic Deadlines</h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800">
                Verified Dates
              </span>
            </div>

            <div className="space-y-4">
              {deadlines.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                  <div>
                    <div className="font-semibold text-slate-200">{d.event}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{d.status}</div>
                  </div>
                  <div className="font-mono font-bold text-indigo-300 text-right bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700">
                    {d.date}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700 text-xs text-slate-400 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Note:</strong> If you are seeking admission after deadline dates, please contact the admissions desk directly. The chatbot does not make exceptions.
              </span>
            </div>
          </div>

          {/* Required Documents Checklist */}
          <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Document Verification Checklist</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Originals + Copies</span>
            </div>

            <div className="grid sm:grid-cols-1 gap-2.5">
              {documents.map((doc, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200/80 text-xs text-slate-700 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{doc}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap gap-3 items-center justify-between">
              <button
                onClick={() => onOpenChatWithTopic('What documents are required for admission verification?')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Ask AI Questions About Document Rules
              </button>

              <button
                onClick={onOpenEnquiry}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Start Your Application
              </button>
            </div>
          </div>

        </div>

        {/* Admissions Helpdesk Banner */}
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-6 sm:p-8 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-base font-bold text-slate-900">Need Guidance from Human Admission Staff?</h4>
            <p className="text-xs text-slate-600">
              Our official admissions officers are available in person or over phone every Monday to Saturday, 9:00 AM – 6:00 PM.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${collegeInfo?.admissionPhone || '+9108045678901'}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-indigo-600" />
              <span>{collegeInfo?.admissionPhone || '+91 (080) 4567-8901'}</span>
            </a>
            <a
              href={`mailto:${collegeInfo?.admissionEmail || 'admissions@apexinstitute.edu'}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-2xs"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-200" />
              <span>{collegeInfo?.admissionEmail || 'admissions@apexinstitute.edu'}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
