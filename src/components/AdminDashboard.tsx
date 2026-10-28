import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  HelpCircle,
  FileText,
  Settings,
  LogOut,
  ArrowLeft,
  Search,
  Download,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Save,
  X,
  Upload,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  MapPin,
  Building2,
} from 'lucide-react';
import { api, tokenStorage } from '../services/api';
import { User, CollegeInfo, Course, FAQ, Enquiry, KnowledgeDocument, DashboardStats, Campus } from '../types';

interface AdminDashboardProps {
  currentUser: User;
  onLogout: () => void;
  onBackToWebsite: () => void;
  onCollegeInfoUpdated: (info: CollegeInfo) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  onBackToWebsite,
  onCollegeInfoUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'courses' | 'campuses' | 'faqs' | 'knowledge' | 'settings'>('overview');

  // Dashboard Data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>([]);
  const [collegeInfo, setCollegeInfo] = useState<CollegeInfo | null>(null);

  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Enquiries filter states
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatus, setEnquiryStatus] = useState('all');
  const [enquiryCategory, setEnquiryCategory] = useState('all');
  const [enquiryCampus, setEnquiryCampus] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [editingNotes, setEditingNotes] = useState('');

  // Course editing modal state
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [isNewCourse, setIsNewCourse] = useState(false);

  // FAQ editing modal state
  const [editingFaq, setEditingFaq] = useState<Partial<FAQ> | null>(null);
  const [isNewFaq, setIsNewFaq] = useState(false);

  // Knowledge Document upload state
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('General');
  const [newDocContent, setNewDocContent] = useState('');
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Settings form
  const [settingsForm, setSettingsForm] = useState<Partial<CollegeInfo>>({});

  useEffect(() => {
    loadAllData();
  }, []);

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const showError = (msg: string) => {
    setActionError(msg);
    setTimeout(() => setActionError(''), 4000);
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [statsRes, enqRes, coursesRes, faqsRes, docsRes, infoRes, campusesRes] = await Promise.all([
        api.getDashboardStats(),
        api.getAdminEnquiries(),
        api.getAdminCourses(),
        api.getAdminFAQs(),
        api.getKnowledgeDocs(),
        api.getCollegeProfile(),
        api.getCampuses(),
      ]);

      setStats(statsRes.data);
      setEnquiries(enqRes.data);
      setCourses(coursesRes.data);
      setFaqs(faqsRes.data);
      setKnowledgeDocs(docsRes.data);
      setCollegeInfo(infoRes.data);
      setSettingsForm(infoRes.data);
      setCampuses(campusesRes.data);
    } catch (err: any) {
      showError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // ENQUIRY ACTIONS
  const handleUpdateEnquiryStatus = async (id: string, newStatus: string) => {
    try {
      const res = await api.updateEnquiry(id, { status: newStatus });
      setEnquiries(prev => prev.map(e => e.id === id ? res.data : e));
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(res.data);
      }
      showSuccess(`Enquiry status updated to ${newStatus}`);
      // Refresh stats
      api.getDashboardStats().then(s => setStats(s.data));
    } catch (err: any) {
      showError(err.message || 'Failed to update status');
    }
  };

  const handleSaveInternalNotes = async () => {
    if (!selectedEnquiry) return;
    try {
      const res = await api.updateEnquiry(selectedEnquiry.id, { internalNotes: editingNotes });
      setEnquiries(prev => prev.map(e => e.id === selectedEnquiry.id ? res.data : e));
      setSelectedEnquiry(res.data);
      showSuccess('Internal notes saved successfully');
    } catch (err: any) {
      showError(err.message || 'Failed to save notes');
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      await api.deleteEnquiry(id);
      setEnquiries(prev => prev.filter(e => e.id !== id));
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      showSuccess('Enquiry deleted');
    } catch (err: any) {
      showError(err.message || 'Failed to delete');
    }
  };

  // COURSE ACTIONS
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    try {
      if (isNewCourse) {
        const res = await api.createCourse(editingCourse);
        setCourses(prev => [...prev, res.data]);
        showSuccess('Course created successfully');
      } else {
        const res = await api.updateCourse(editingCourse.id!, editingCourse);
        setCourses(prev => prev.map(c => c.id === res.data.id ? res.data : c));
        showSuccess('Course updated successfully');
      }
      setEditingCourse(null);
    } catch (err: any) {
      showError(err.message || 'Failed to save course');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course from the catalog?')) return;
    try {
      await api.deleteCourse(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      showSuccess('Course removed');
    } catch (err: any) {
      showError(err.message || 'Failed to delete course');
    }
  };

  // FAQ ACTIONS
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    try {
      if (isNewFaq) {
        const res = await api.createFAQ(editingFaq);
        setFaqs(prev => [...prev, res.data]);
        showSuccess('FAQ created successfully');
      } else {
        const res = await api.updateFAQ(editingFaq.id!, editingFaq);
        setFaqs(prev => prev.map(f => f.id === res.data.id ? res.data : f));
        showSuccess('FAQ updated successfully');
      }
      setEditingFaq(null);
    } catch (err: any) {
      showError(err.message || 'Failed to save FAQ');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await api.deleteFAQ(id);
      setFaqs(prev => prev.filter(f => f.id !== id));
      showSuccess('FAQ deleted');
    } catch (err: any) {
      showError(err.message || 'Failed to delete FAQ');
    }
  };

  // KNOWLEDGE BASE ACTIONS
  const handleAddKnowledgeDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !newDocContent.trim()) {
      showError('Please provide a document title and verifiable text content');
      return;
    }

    try {
      setIsUploadingDoc(true);
      const formData = new FormData();
      formData.append('title', newDocTitle);
      formData.append('category', newDocCategory);
      formData.append('content', newDocContent);
      formData.append('fileName', `${newDocTitle.replace(/\s+/g, '_')}.txt`);

      const res = await api.createKnowledgeDoc(formData);
      setKnowledgeDocs(prev => [...prev, res.data]);
      setNewDocTitle('');
      setNewDocContent('');
      showSuccess(res.message || 'Document indexed into knowledge chunks successfully!');
      // reload stats
      api.getDashboardStats().then(s => setStats(s.data));
    } catch (err: any) {
      showError(err.message || 'Failed to upload document');
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleReprocessDoc = async (id: string) => {
    try {
      const res = await api.reprocessKnowledgeDoc(id);
      setKnowledgeDocs(prev => prev.map(d => d.id === id ? res.data : d));
      showSuccess('Document re-chunked and re-indexed into knowledge base');
    } catch (err: any) {
      showError(err.message || 'Failed to reprocess document');
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document and remove its chunks from the RAG search index?')) return;
    try {
      await api.deleteKnowledgeDoc(id);
      setKnowledgeDocs(prev => prev.filter(d => d.id !== id));
      showSuccess('Document deleted from knowledge base');
    } catch (err: any) {
      showError(err.message || 'Failed to delete document');
    }
  };

  // COLLEGE SETTINGS ACTIONS
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.updateCollegeInfo(settingsForm);
      setCollegeInfo(res.data);
      onCollegeInfoUpdated(res.data);
      showSuccess('College settings and contact information updated successfully');
    } catch (err: any) {
      showError(err.message || 'Failed to update settings');
    }
  };

  // Filtered Enquiries
  const filteredEnquiries = enquiries.filter(e => {
    const matchStatus = enquiryStatus === 'all' || e.status === enquiryStatus;
    const matchCat = enquiryCategory === 'all' || e.category.toLowerCase() === enquiryCategory.toLowerCase();
    const matchCampus = enquiryCampus === 'all' || (e.campus && e.campus.toLowerCase().includes(enquiryCampus.toLowerCase()));
    const matchSearch = !enquirySearch ||
      e.refNumber.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      e.studentName.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      e.email.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      e.message.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      (e.campus && e.campus.toLowerCase().includes(enquirySearch.toLowerCase()));
    return matchStatus && matchCat && matchCampus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased">
      {/* Top Admin Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToWebsite}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Public Website</span>
          </button>
          <div>
            <h1 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>{collegeInfo?.collegeName || 'Campus Administration'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Staff Console
              </span>
            </h1>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-bold text-white">{currentUser.name}</div>
            <div className="text-[11px] text-slate-400 capitalize">{currentUser.role} Account • {currentUser.email}</div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 space-y-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'enquiries' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4" />
              <span>Student Enquiries</span>
            </div>
            {stats && stats.pendingEnquiries > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'enquiries' ? 'bg-indigo-800 text-white' : 'bg-amber-100 text-amber-800'}`}>
                {stats.pendingEnquiries}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'courses' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Courses Catalog ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('campuses')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'campuses' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Campuses & Centers ({campuses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'faqs' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQs Manager ({faqs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('knowledge')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'knowledge' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4" />
              <span>AI Knowledge Base</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'knowledge' ? 'bg-indigo-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
              RAG
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>College Profile & Contacts</span>
          </button>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-65px)]">
          {/* Notifications */}
          {actionSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 shadow-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {actionError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2 shadow-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{actionError}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Enquiry Analytics & Performance</h2>
                <p className="text-xs text-slate-500 mt-1">Real-time overview of student inquiries, admissions metrics, and AI assistant interactions.</p>
              </div>

              {/* Metric KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-xs font-semibold text-slate-500">Total Enquiries</span>
                  <div className="text-3xl font-black text-slate-900">{stats.totalEnquiries}</div>
                  <span className="text-[11px] text-emerald-600 font-medium">+{stats.todayEnquiries} submitted today</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-xs font-semibold text-slate-500">Pending Follow-up</span>
                  <div className="text-3xl font-black text-amber-600">{stats.pendingEnquiries}</div>
                  <span className="text-[11px] text-slate-500">Awaiting staff response</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-xs font-semibold text-slate-500">Resolved Enquiries</span>
                  <div className="text-3xl font-black text-emerald-600">{stats.resolvedEnquiries}</div>
                  <span className="text-[11px] text-slate-500">Successfully handled</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-xs font-semibold text-slate-500">AI Chat Interactions</span>
                  <div className="text-3xl font-black text-indigo-600">{stats.totalChatInteractions}</div>
                  <span className="text-[11px] text-slate-500">24/7 automated queries</span>
                </div>
              </div>

              {/* Category Breakdown & FAQ Popularity */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Enquiries by Category */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
                    <span>Enquiries by Category</span>
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(stats.enquiriesByCategory).map(([cat, count]) => {
                      const pct = Math.round((count / (stats.totalEnquiries || 1)) * 100);
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-700">{cat}</span>
                            <span className="text-slate-500">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Most Frequently Asked Questions */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
                    <span>Most Frequently Asked Questions</span>
                    <HelpCircle className="w-4 h-4 text-violet-600" />
                  </h3>
                  <div className="space-y-3">
                    {stats.topFAQs.map((faq) => (
                      <div key={faq.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <div className="font-semibold text-slate-800 line-clamp-1">{faq.question}</div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span className="text-indigo-600 font-medium">{faq.category}</span>
                          <span>Asked {faq.timesAsked} times</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RAG Knowledge Status */}
              <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-bold text-base">RAG Semantic Search Status: Healthy</h4>
                  <p className="text-xs text-indigo-200">
                    {stats.totalDocs} verified official documents chunked into {stats.totalChunks} searchable vector/keyword passages.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('knowledge')}
                  className="px-4 py-2 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 transition-colors"
                >
                  Manage Knowledge Base
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ENQUIRIES MANAGEMENT */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Student Enquiries Management</h2>
                  <p className="text-xs text-slate-500 mt-1">Review, assign, resolve, and export all submitted college admissions enquiries.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadAllData}
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                    title="Refresh records"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={api.exportEnquiriesCsv}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Filters row */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by student name, ref #, or email..."
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <select
                    value={enquiryStatus}
                    onChange={(e) => setEnquiryStatus(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>

                  <select
                    value={enquiryCategory}
                    onChange={(e) => setEnquiryCategory(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
                  >
                    <option value="all">All Categories</option>
                    <option value="Admissions">Admissions</option>
                    <option value="Courses">Courses</option>
                    <option value="Fees">Fees</option>
                    <option value="Scholarships">Scholarships</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Placements">Placements</option>
                  </select>

                  <select
                    value={enquiryCampus}
                    onChange={(e) => setEnquiryCampus(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium"
                  >
                    <option value="all">All Campuses</option>
                    {campuses.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Enquiries Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Ref #</th>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Category & Course</th>
                        <th className="py-3 px-4">Campus Location</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Submitted</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredEnquiries.map((enq) => (
                        <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                            {enq.refNumber}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{enq.studentName}</div>
                            <div className="text-[11px] text-slate-500">{enq.email} • {enq.phone || 'No phone'}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-800">{enq.category}</span>
                            <div className="text-[11px] text-slate-500">{enq.courseOfInterest}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                              <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                              {enq.campus || 'Main Campus'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={enq.status}
                              onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value)}
                              className={`text-[11px] font-bold px-2 py-1 rounded-md border cursor-pointer ${
                                enq.status === 'resolved'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : enq.status === 'in_progress'
                                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">
                            {new Date(enq.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-right space-x-1">
                            <button
                              onClick={() => {
                                setSelectedEnquiry(enq);
                                setEditingNotes(enq.internalNotes || '');
                              }}
                              className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer"
                              title="View details & notes"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEnquiry(enq.id)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredEnquiries.length === 0 && (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No enquiries match the current filter criteria.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: COURSES MANAGEMENT */}
          {activeTab === 'courses' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Manage Course Catalog</h2>
                  <p className="text-xs text-slate-500 mt-1">Add, update fees, modify intake seats, or archive courses.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingCourse({
                      name: '',
                      code: `CRS-${Math.floor(100 + Math.random() * 900)}`,
                      degree: 'B.Tech',
                      department: 'Computer Science',
                      duration: '4 Years',
                      eligibility: '10+2 with PCM minimum 60%',
                      seats: 60,
                      feesPerYear: 120000,
                      description: '',
                      curriculumHighlights: [],
                      careerProspects: [],
                      isActive: true,
                    });
                    setIsNewCourse(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Course</span>
                </button>
              </div>

              {/* Courses Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold">
                        {course.degree}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${course.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {course.isActive ? 'Active' : 'Archived'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 leading-snug">{course.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>

                    <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Annual Tuition:</span>
                        <strong className="text-slate-900">₹{course.feesPerYear.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Intake Capacity:</span>
                        <strong className="text-slate-900">{course.seats} Seats</strong>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setEditingCourse(course);
                          setIsNewCourse(false);
                        }}
                        className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 font-semibold"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CAMPUSES & REGIONAL CENTERS */}
          {activeTab === 'campuses' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Campus Locations & Academic Centers</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage multi-campus operations, location-specific enquiry routing, and student capacity metrics.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                    {campuses.length} Campuses Active
                  </span>
                </div>
              </div>

              {/* Campus Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campuses.map((camp) => {
                  const campusCourses = courses.filter(c =>
                    !c.campuses || c.campuses.length === 0 || c.campuses.some(cc => cc.toLowerCase().includes(camp.name.toLowerCase()))
                  );
                  const campusEnquiries = enquiries.filter(e =>
                    e.campus && e.campus.toLowerCase().includes(camp.name.toLowerCase())
                  );

                  return (
                    <div key={camp.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {camp.isActive ? 'Operating' : 'Planned'}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-extrabold text-slate-900 leading-snug">{camp.name}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span>{camp.address}, {camp.city}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {camp.highlight}
                        </p>

                        <div className="bg-slate-50 p-3.5 rounded-xl space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Established:</span>
                            <strong className="text-slate-800">{camp.establishedYear}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Campus Area:</span>
                            <strong className="text-slate-800">{camp.areaAcres} Acres</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Programs Offered:</span>
                            <strong className="text-indigo-600">{campusCourses.length} Programs</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Active Enquiries:</span>
                            <strong className="text-emerald-700">{campusEnquiries.length} Enquiries</strong>
                          </div>
                        </div>

                        {/* Specializations */}
                        {camp.keySpecializations && camp.keySpecializations.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Specializations</span>
                            <div className="flex flex-wrap gap-1.5">
                              {camp.keySpecializations.map((spec: string, i: number) => (
                                <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>{camp.phone}</span>
                        <button
                          onClick={() => {
                            setEnquiryCampus(camp.name);
                            setActiveTab('enquiries');
                          }}
                          className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                        >
                          View Inquiries →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: FAQS MANAGEMENT */}
          {activeTab === 'faqs' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Manage Frequently Asked Questions</h2>
                  <p className="text-xs text-slate-500 mt-1">Update answers to common student questions across admissions, fees, and hostels.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingFaq({
                      question: '',
                      answer: '',
                      category: 'Admissions',
                      displayOrder: faqs.length + 1,
                      isActive: true,
                    });
                    setIsNewFaq(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New FAQ</span>
                </button>
              </div>

              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div key={faq.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                          {faq.category}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1.5">{faq.question}</h4>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setEditingFaq(faq);
                            setIsNewFaq(false);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFaq(faq.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                    <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
                      <span>Order: #{faq.displayOrder}</span>
                      <span>Asked {faq.timesAsked} times</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: KNOWLEDGE BASE RAG MANAGEMENT */}
          {activeTab === 'knowledge' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-2xl font-black text-slate-900">AI Knowledge Base & RAG Index</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Upload official college documents. The system automatically segments them into semantic chunks to ground the AI Chatbot and prevent hallucinations.
                </p>
              </div>

              {/* Upload Document Box */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-600" />
                  <span>Ingest New College Knowledge Document</span>
                </h3>

                <form onSubmit={handleAddKnowledgeDoc} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Document Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Scholarship Policy 2026-27"
                        value={newDocTitle}
                        onChange={(e) => setNewDocTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                      <select
                        value={newDocCategory}
                        onChange={(e) => setNewDocCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="Admissions">Admissions</option>
                        <option value="Fees">Fees & Scholarships</option>
                        <option value="Placements">Placements</option>
                        <option value="Facilities">Facilities & Hostel</option>
                        <option value="Policies">Academic Policies</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Document Content (Plain text / Markdown / Brochure extract)
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Paste official college document sections, fee tables, eligibility rules, or hostel guidelines..."
                      value={newDocContent}
                      onChange={(e) => setNewDocContent(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    ></textarea>
                    <span className="text-[10px] text-slate-400">Content will be automatically split into ~300-500 word retrieval chunks</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isUploadingDoc}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {isUploadingDoc ? 'Chunking & Indexing...' : 'Upload & Process Document'}
                  </button>
                </form>
              </div>

              {/* Ingested Documents List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Indexed Knowledge Documents ({knowledgeDocs.length})</h3>
                {knowledgeDocs.map((doc) => (
                  <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{doc.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {doc.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        Category: <strong className="text-slate-700">{doc.category}</strong> • File: {doc.fileName} • Chunks: <strong className="text-indigo-600">{doc.chunkCount} searchable units</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleReprocessDoc(doc.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                        title="Re-chunk and regenerate keywords"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reprocess</span>
                      </button>
                      <button
                        onClick={() => handleDeleteDoc(doc.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs"
                        title="Delete document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && collegeInfo && (
            <div className="space-y-6 animate-in fade-in max-w-4xl">
              <div>
                <h2 className="text-2xl font-black text-slate-900">College Profile & Public Settings</h2>
                <p className="text-xs text-slate-500 mt-1">Changes made here immediately update the website headers, footer, and AI Chatbot directory.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">College Name</label>
                    <input
                      type="text"
                      value={settingsForm.collegeName || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, collegeName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settingsForm.tagline || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">College Overview / Description</label>
                  <textarea
                    rows={3}
                    value={settingsForm.description || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  ></textarea>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Admissions Phone Helpline</label>
                    <input
                      type="text"
                      value={settingsForm.admissionPhone || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, admissionPhone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Admissions Email Address</label>
                    <input
                      type="email"
                      value={settingsForm.admissionEmail || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, admissionEmail: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Campus Address</label>
                    <input
                      type="text"
                      value={settingsForm.address || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={settingsForm.city || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">State & Pincode</label>
                    <input
                      type="text"
                      value={`${settingsForm.state || ''} - ${settingsForm.pincode || ''}`}
                      onChange={(e) => {
                        const parts = e.target.value.split('-');
                        setSettingsForm({
                          ...settingsForm,
                          state: parts[0]?.trim() || '',
                          pincode: parts[1]?.trim() || '',
                        });
                      }}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save College Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: View Enquiry & Internal Notes */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-indigo-600">{selectedEnquiry.refNumber}</span>
                <span className="text-xs text-slate-400">• {selectedEnquiry.category}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">{selectedEnquiry.studentName}</h3>
              <p className="text-xs text-slate-500">{selectedEnquiry.email} • {selectedEnquiry.phone || 'No phone'}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-2">
              <div className="font-semibold text-slate-800">Course of Interest: {selectedEnquiry.courseOfInterest}</div>
              <div className="font-semibold text-slate-800">Preferred Contact: {selectedEnquiry.preferredContact}</div>
              <div className="pt-2 text-slate-700 leading-relaxed border-t border-slate-200">
                "{selectedEnquiry.message}"
              </div>
            </div>

            {/* Internal Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Internal Staff Notes</label>
              <textarea
                rows={3}
                placeholder="Log phone calls, follow-up emails, or scholarship approval details..."
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-normal"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Status:</span>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => handleUpdateEnquiryStatus(selectedEnquiry.id, e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-bold"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <button
                onClick={handleSaveInternalNotes}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit/Add Course */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setEditingCourse(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900">
              {isNewCourse ? 'Add New Course' : 'Edit Course Details'}
            </h3>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  value={editingCourse.name || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Degree</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.degree || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, degree: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.department || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Annual Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingCourse.feesPerYear || 0}
                    onChange={(e) => setEditingCourse({ ...editingCourse, feesPerYear: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Intake Seats</label>
                  <input
                    type="number"
                    required
                    value={editingCourse.seats || 0}
                    onChange={(e) => setEditingCourse({ ...editingCourse, seats: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  required
                  value={editingCourse.eligibility || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, eligibility: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Campus Allocation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Offered At Campuses</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {campuses.map((camp) => {
                    const isChecked = editingCourse.campuses?.includes(camp.name);
                    return (
                      <label
                        key={camp.id}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={!!isChecked}
                          onChange={(e) => {
                            const current = editingCourse.campuses || [];
                            if (e.target.checked) {
                              setEditingCourse({ ...editingCourse, campuses: [...current, camp.name] });
                            } else {
                              setEditingCourse({ ...editingCourse, campuses: current.filter(c => c !== camp.name) });
                            }
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{camp.name.split('(')[0].trim()}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCourse.description || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit/Add FAQ */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setEditingFaq(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900">
              {isNewFaq ? 'Add New FAQ' : 'Edit FAQ'}
            </h3>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={editingFaq.category || 'General'}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Admissions">Admissions</option>
                  <option value="Fees">Fees</option>
                  <option value="Scholarships">Scholarships</option>
                  <option value="Placements">Placements</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Transportation">Transportation</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Answer</label>
                <textarea
                  rows={4}
                  required
                  value={editingFaq.answer || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
