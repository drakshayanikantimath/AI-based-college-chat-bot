import React, { useState, useEffect } from 'react';
import { X, Search, CheckCircle2, Clock, AlertCircle, ArrowRight, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { Enquiry } from '../types';

interface EnquiryStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRef?: string;
}

export const EnquiryStatusModal: React.FC<EnquiryStatusModalProps> = ({
  isOpen,
  onClose,
  initialRef = '',
}) => {
  const [refNumber, setRefNumber] = useState(initialRef);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Enquiry | null>(null);

  useEffect(() => {
    if (initialRef) {
      setRefNumber(initialRef);
      handleLookup(initialRef);
    }
  }, [initialRef]);

  if (!isOpen) return null;

  const handleLookup = async (lookupRef?: string) => {
    const target = (lookupRef || refNumber).trim();
    if (!target) {
      setError('Please enter your enquiry reference number (e.g., ENQ-2026-92814)');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);
      const res = await api.lookupEnquiry(target);
      setResult(res.data);
    } catch (err: any) {
      setError(err.message || 'No enquiry found with this reference number.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Resolved & Handled
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            <Clock className="w-4 h-4 text-blue-600" />
            In Review by Staff
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
            <Clock className="w-4 h-4 text-amber-600" />
            Pending Officer Assignment
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
              <Search className="w-3.5 h-3.5" />
              <span>Public Tracking Portal</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">Check Enquiry Status</h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter the unique reference number you received when submitting your enquiry.
            </p>
          </div>

          {/* Search bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. ENQ-2026-92814"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                className="w-full pl-10 pr-3 py-2.5 text-xs font-mono uppercase bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={() => handleLookup()}
              disabled={loading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Result Card */}
          {result && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="font-mono text-xs font-bold text-slate-500">{result.refNumber}</span>
                {getStatusBadge(result.status)}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Student Name</span>
                  <span className="font-bold text-slate-800">{result.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Category</span>
                  <span className="font-semibold text-slate-800">{result.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Campus Location</span>
                  <span className="font-semibold text-indigo-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                    {result.campus || 'Main Campus (Tech Valley)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Course of Interest</span>
                  <span className="font-semibold text-slate-800">{result.courseOfInterest}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Submitted On</span>
                  <span className="text-slate-700">{new Date(result.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200/60 flex items-center justify-between">
                <span>Last updated: {new Date(result.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-emerald-700 font-medium">Official Registry Record</span>
              </div>
            </div>
          )}

          <div className="p-3 bg-indigo-50/60 rounded-xl text-center text-xs text-slate-600">
            Forgot your reference number? Please contact Admissions at{' '}
            <strong className="text-indigo-900">1800-200-APEX</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};
