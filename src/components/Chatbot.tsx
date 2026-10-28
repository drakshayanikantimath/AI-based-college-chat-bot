import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  CornerDownLeft,
  ChevronDown,
  ArrowRight,
  PhoneCall,
  FileText,
  MapPin,
  Building2,
} from 'lucide-react';
import { api } from '../services/api';
import { ChatMessage, CollegeInfo, Campus } from '../types';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  collegeInfo: CollegeInfo | null;
  campuses?: Campus[];
  selectedCampus?: string;
  onSelectCampus?: (campus: string) => void;
  onOpenEnquiry: () => void;
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  isOpen,
  onClose,
  collegeInfo,
  campuses = [],
  selectedCampus = 'All',
  onSelectCampus,
  onOpenEnquiry,
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.floor(Math.random() * 1000)}`);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultWelcomeMessage: ChatMessage = {
    id: 'msg-welcome',
    sender: 'bot',
    text: "Hello! Welcome to our College Enquiry Assistant. I'm here to help you with admissions, courses, fees, eligibility, scholarships, placements, hostel facilities, and more. What would you like to know?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    confidence: 'verified',
    suggestedFollowUps: [
      'What courses does the college offer?',
      'What are the admission requirements?',
      'What is the fee structure?',
      'Are scholarships available?',
      'What are the placement opportunities?',
      'Is hostel accommodation available?',
      'What documents are required for admission?',
      'How can I contact the admission office?',
    ],
  };

  // Initialize or load session messages
  useEffect(() => {
    const saved = sessionStorage.getItem('campus_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages([defaultWelcomeMessage]);
      }
    } else {
      setMessages([defaultWelcomeMessage]);
    }
  }, []);

  // Sync to session storage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('campus_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Handle external prompts (e.g. from course card "Ask AI" or hero chips)
  useEffect(() => {
    if (externalPrompt && externalPrompt.trim()) {
      handleSendMessage(externalPrompt.trim());
      if (onClearExternalPrompt) {
        onClearExternalPrompt();
      }
    }
  }, [externalPrompt]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend || loading) return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      // Build lightweight conversation history for Gemini API
      const historyPayload = messages.slice(-6).map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: m.text }],
      }));

      const res = await api.sendChatMessage({
        message: textToSend,
        sessionId,
        history: historyPayload,
        campus: selectedCampus !== 'All' ? selectedCampus : undefined,
      });

      const botMessage: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: res.sources,
        suggestedFollowUps: res.suggestedFollowUps,
        confidence: res.confidence,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errMessage: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'bot',
        text: "I'm sorry, I couldn't find verified information about this in the college knowledge base. Please contact the college enquiry or admission office for confirmation at " +
          (collegeInfo?.admissionPhone || '1800-200-APEX') + ' or ' + (collegeInfo?.admissionEmail || 'admissions@apexinstitute.edu'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 'unverified',
        suggestedFollowUps: [
          'What courses does the college offer?',
          'What are the admission requirements?',
          'How can I submit an enquiry form?'
        ],
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeech = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols from speech
    const cleanText = text.replace(/[*_#`\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleClearHistory = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingId(null);
    sessionStorage.removeItem('campus_chat_history');
    setMessages([defaultWelcomeMessage]);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 flex flex-col shadow-2xl overflow-hidden border border-slate-200/90 ${
        isExpanded
          ? 'inset-2 sm:inset-6 md:inset-10 rounded-3xl bg-white'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[440px] h-[640px] max-h-[88vh] rounded-3xl bg-white'
      }`}
    >
      {/* Chat Window Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:px-5 flex items-center justify-between border-b border-indigo-900/40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">CampusQuery Assistant</h3>
              <span className="text-[10px] font-medium bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800">
                24/7 Live
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Verified RAG Intelligence • {collegeInfo?.collegeName || 'Apex Institute'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            title="Clear Chat History"
            className="p-1.5 text-slate-400 hover:text-rose-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Minimize Window' : 'Expand to Fullscreen'}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden sm:block cursor-pointer"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            title="Close Chat"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Campus Context Quick Switcher */}
      {campuses && campuses.length > 0 && (
        <div className="bg-slate-900 border-b border-indigo-900/40 px-4 py-2 flex items-center justify-between text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Target Campus:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <select
              value={selectedCampus}
              onChange={(e) => onSelectCampus && onSelectCampus(e.target.value)}
              className="bg-slate-800 border border-slate-700 hover:border-indigo-500 text-indigo-200 text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-hidden cursor-pointer transition-colors"
            >
              <option value="All">All Campuses (General AI)</option>
              {campuses.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
          >
            {msg.sender === 'user' ? (
              /* User Bubble */
              <div className="max-w-[85%] bg-indigo-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-xs text-xs sm:text-sm font-medium shadow-xs">
                {msg.text}
                <div className="text-[10px] text-indigo-200 text-right mt-1 font-mono">
                  {msg.timestamp}
                </div>
              </div>
            ) : (
              /* Bot Bubble */
              <div className="max-w-[92%] space-y-2">
                <div className="bg-white border border-slate-200/90 text-slate-800 p-4 rounded-2xl rounded-tl-xs shadow-xs space-y-3">
                  {/* Verification indicator */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-900">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {msg.confidence === 'unverified' ? 'General College Assistance' : 'Verified College Knowledge'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>

                  {/* Body Text */}
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans text-slate-700">
                    {msg.text}
                  </div>

                  {/* Document Sources Cited */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-indigo-500" />
                        <span>Sources & Citations:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center text-[10px] bg-indigo-50 text-indigo-800 font-medium px-2 py-0.5 rounded-md border border-indigo-100"
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Action Bar (Copy, TTS) */}
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="flex items-center gap-1 hover:text-indigo-600 transition-colors p-1 rounded-md hover:bg-slate-50 cursor-pointer"
                        title="Copy answer to clipboard"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>

                      {'speechSynthesis' in window && (
                        <button
                          onClick={() => handleSpeech(msg.id, msg.text)}
                          className={`flex items-center gap-1 transition-colors p-1 rounded-md hover:bg-slate-50 cursor-pointer ${
                            speakingId === msg.id ? 'text-indigo-600 font-bold' : 'hover:text-indigo-600'
                          }`}
                          title="Listen to this answer"
                        >
                          {speakingId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          <span>{speakingId === msg.id ? 'Stop' : 'Listen'}</span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={onOpenEnquiry}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline decoration-indigo-300 cursor-pointer"
                    >
                      Need Human Staff? Enquire →
                    </button>
                  </div>
                </div>

                {/* Suggested Follow-up chips */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="space-y-1.5 pt-1 pl-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Suggested Questions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(chip)}
                          className="text-xs bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200/90 hover:border-indigo-200 px-3 py-1.5 rounded-xl font-medium transition-all shadow-2xs text-left cursor-pointer active:scale-98"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-2 animate-in fade-in">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-xs shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs text-slate-500 font-medium ml-1">
                  Searching knowledge base & generating verified answer...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 space-y-2 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about admissions, cutoff ranks, fees, scholarships, hostels..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              className="w-full pl-4 pr-10 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-normal placeholder:text-slate-400"
            />
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="w-11 h-11 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-all shadow-md shadow-indigo-500/25 active:scale-95 cursor-pointer"
            title="Send query (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Micro Footer Notice */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span className="flex items-center gap-1 text-slate-500">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> Grounded in official college documents
          </span>
          <span className="hidden sm:inline">Press Enter to send</span>
        </div>
      </div>
    </div>
  );
};
