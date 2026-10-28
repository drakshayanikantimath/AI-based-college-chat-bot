import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle, Copy, AlertCircle, Sparkles, ShieldCheck, MapPin, Building2 } from 'lucide-react';
import { api } from '../services/api';
import { Course, Campus } from '../types';

interface EnquiryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  campuses?: Campus[];
  selectedCampus?: string;
  initialCourse?: string;
  onTrackSubmittedRef?: (ref: string) => void;
}

export const EnquiryFormModal: React.FC<EnquiryFormModalProps> = ({
  isOpen,
  onClose,
  courses,
  campuses = [],
  selectedCampus = 'All',
  initialCourse = '',
  onTrackSubmittedRef,
}) => {
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [campus, setCampus] = useState(
    selectedCampus && selectedCampus !== 'All' ? selectedCampus : 'Main Campus (Tech Valley)'
  );
  const [courseOfInterest, setCourseOfInterest] = useState(initialCourse || 'General Enquiry');
  const [category, setCategory] = useState<'Admissions' | 'Courses' | 'Fees' | 'Scholarships' | 'Placements' | 'Hostel' | 'Transportation' | 'General enquiry'>('Admissions');
  const [message, setMessage] = useState('');
  const [preferredContact, setPreferredContact] = useState<'Email' | 'Phone' | 'WhatsApp'>('Email');
  const [consent, setConsent] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialCourse) {
      setCourseOfInterest(initialCourse);
    }
  }, [initialCourse]);

  useEffect(() => {
    if (selectedCampus && selectedCampus !== 'All') {
      setCampus(selectedCampus);
    }
  }, [selectedCampus]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!studentName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setErrorMessage('Please enter an enquiry message with at least 10 characters');
      return;
    }
    if (!consent) {
      setErrorMessage('You must consent to the privacy policy to submit your enquiry');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.submitEnquiry({
        studentName,
        email,
        phone,
        campus: campus || 'Main Campus (Tech Valley)',
        courseOfInterest,
        category,
        message,
        preferredContact,
        consent,
      });

      setSubmittedRef(res.refNumber);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (submittedRef) {
      navigator.clipboard.writeText(submittedRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const resetForm = () => {
    setSubmittedRef(null);
    setStudentName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setConsent(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={resetForm}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedRef ? (
          /* Submission Success View */
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">Enquiry Submitted Successfully!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Thank you, <strong>{studentName}</strong>. Your enquiry has been received by our Admissions & Student Support Team for <strong>{campus}</strong>.
              </p>
            </div>

            {/* Reference Number Box */}
            <div className="bg-slate-50 border-2 border-dashed border-indigo-200 rounded-2xl p-5 max-w-sm mx-auto space-y-2">
              <div className="text-xs uppercase font-bold tracking-wider text-slate-500">Your Enquiry Reference Number</div>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-xl sm:text-2xl font-black text-indigo-600">{submittedRef}</span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span>Campus: <strong>{campus}</strong></span>
              </div>
              <p className="text-[11px] text-slate-500">
                Save this number to check your resolution status anytime.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              {onTrackSubmittedRef && (
                <button
                  onClick={() => {
                    const ref = submittedRef;
                    resetForm();
                    onTrackSubmittedRef(ref);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Track This Enquiry Now
                </button>
              )}
              <button
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                Done / Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Admissions & Support Helpdesk</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Submit a Student Enquiry</h3>
              <p className="text-xs text-slate-500 mt-1">
                Have specific admission, fee, or hostel questions? Submit this form to receive a response from our college staff within 24 hours.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Phone & Preferred Contact */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Contact Mode
                  </label>
                  <select
                    value={preferredContact}
                    onChange={(e) => setPreferredContact(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Email">Email</option>
                    <option value="Phone">Phone Call</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>
              </div>

              {/* Campus Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Preferred Campus Location <span className="text-rose-500">*</span></span>
                </label>
                <select
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-800"
                >
                  {campuses && campuses.length > 0 ? (
                    campuses.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} — {c.city}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Main Campus (Tech Valley)">Main Campus (Tech Valley, Bangalore)</option>
                      <option value="City Innovation Campus (Indiranagar)">City Innovation Campus (Indiranagar, Bangalore)</option>
                      <option value="Green Hills Tech Campus (Electronic City)">Green Hills Tech Campus (Electronic City, Bangalore)</option>
                    </>
                  )}
                  <option value="Undecided / Open to all Campuses">Undecided / Open to all Campuses</option>
                </select>
              </div>

              {/* Category & Course of Interest */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enquiry Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  >
                    <option value="Admissions">Admissions</option>
                    <option value="Courses">Courses</option>
                    <option value="Fees">Fees & Installments</option>
                    <option value="Scholarships">Scholarships</option>
                    <option value="Placements">Placements</option>
                    <option value="Hostel">Hostel Accommodation</option>
                    <option value="Transportation">Transportation</option>
                    <option value="General enquiry">General enquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Course of Interest
                  </label>
                  <select
                    value={courseOfInterest}
                    onChange={(e) => setCourseOfInterest(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="General Enquiry">General / Undecided</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.degree})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message / Question */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Specific Question or Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail your question regarding fees, cutoffs, hostel accommodation, or syllabus..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                ></textarea>
                <span className="text-[10px] text-slate-400">Minimum 10 characters</span>
              </div>

              {/* Privacy Consent Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="consent" className="text-xs text-slate-600 leading-snug cursor-pointer">
                  I agree to the college privacy notice and authorize admissions staff to contact me regarding my academic enquiry.
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Registering Enquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Official Enquiry</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted & saved in PostgreSQL with unique reference tracking</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
