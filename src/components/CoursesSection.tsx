import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, Clock, Users, ArrowUpRight, CheckCircle2, Bot, HelpCircle, X, Sparkles, MapPin, Building2 } from 'lucide-react';
import { Course, Campus } from '../types';

interface CoursesSectionProps {
  courses: Course[];
  campuses?: Campus[];
  selectedCampus?: string;
  onSelectCampus?: (campusName: string) => void;
  onOpenChatWithCourse: (courseName: string) => void;
  onOpenEnquiryForCourse: (courseName: string) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  courses,
  campuses = [],
  selectedCampus = 'All',
  onSelectCampus,
  onOpenChatWithCourse,
  onOpenEnquiryForCourse,
}) => {
  const [selectedDegree, setSelectedDegree] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [detailedCourse, setDetailedCourse] = useState<Course | null>(null);

  // Extract unique degrees and departments
  const degrees = useMemo(() => {
    const list = ['All', ...new Set(courses.map(c => c.degree))];
    return list;
  }, [courses]);

  const departments = useMemo(() => {
    const list = ['All', ...new Set(courses.map(c => c.department))];
    return list;
  }, [courses]);

  // Filtered courses based on degree, department, search, and campus
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchDegree = selectedDegree === 'All' || c.degree.toLowerCase() === selectedDegree.toLowerCase();
      const matchDept = selectedDepartment === 'All' || c.department.toLowerCase() === selectedDepartment.toLowerCase();
      
      const matchCampus =
        !selectedCampus ||
        selectedCampus === 'All' ||
        !c.campuses ||
        c.campuses.length === 0 ||
        c.campuses.some(
          camp =>
            camp.toLowerCase().includes(selectedCampus.toLowerCase()) ||
            selectedCampus.toLowerCase().includes(camp.toLowerCase())
        );

      const matchSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.campuses && c.campuses.some(camp => camp.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchDegree && matchDept && matchCampus && matchSearch;
    });
  }, [courses, selectedDegree, selectedDepartment, selectedCampus, searchQuery]);

  return (
    <section id="courses" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Academic Programs 2026-27
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Undergraduate & Postgraduate Degrees
          </h2>
          <p className="text-base text-slate-600">
            Accredited by AICTE and NBA. Every course is equipped with industry-aligned curricula, cutting-edge labs, and structured placement preparation.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search courses by title, code or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Department & Campus dropdowns */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Campus filter dropdown */}
              {campuses && campuses.length > 0 && (
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <select
                    value={selectedCampus}
                    onChange={(e) => onSelectCampus && onSelectCampus(e.target.value)}
                    className="text-xs font-semibold bg-transparent border-0 text-slate-700 focus:outline-hidden cursor-pointer"
                  >
                    <option value="All">All Campuses</option>
                    {campuses.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Department dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="text-xs font-medium bg-transparent border-0 text-slate-700 focus:outline-hidden cursor-pointer"
                >
                  <option value="All">All Departments</option>
                  {departments.filter(d => d !== 'All').map((dept, i) => (
                    <option key={i} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Degree Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap mr-1">Degree:</span>
            {degrees.map((deg) => (
              <button
                key={deg}
                onClick={() => setSelectedDegree(deg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedDegree === deg
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {deg}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 font-medium px-1 gap-2">
          <div className="flex items-center gap-2">
            <span>Showing {filteredCourses.length} accredited program{filteredCourses.length === 1 ? '' : 's'}</span>
            {selectedCampus !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-200">
                <MapPin className="w-3 h-3 text-indigo-600" />
                {selectedCampus}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> All course fees & seats officially verified
          </span>
        </div>

        {/* Courses Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                    {course.degree}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {course.code}
                  </span>
                </div>

                {/* Course Name */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {course.name}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                {/* Campus Availability Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-indigo-500" /> Offered at:
                  </span>
                  {(course.campuses && course.campuses.length > 0 ? course.campuses : ['Main Campus (Tech Valley)']).map((camp, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-[10px] font-semibold transition-colors"
                      title={`Available at ${camp}`}
                    >
                      {camp.split('(')[0].trim()}
                    </span>
                  ))}
                </div>

                {/* Metadata Pills */}
                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-violet-500" />
                    <span><strong>{course.seats}</strong> Verified Seats</span>
                  </div>
                </div>

                {/* Fees and Eligibility Box */}
                <div className="bg-slate-50 p-3 rounded-xl space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">Annual Tuition Fee</span>
                    <span className="text-sm font-extrabold text-slate-900">
                      ₹{course.feesPerYear.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] font-normal text-slate-500">/ year</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 line-clamp-2">
                    <span className="font-semibold text-slate-700">Eligibility:</span> {course.eligibility}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setDetailedCourse(course)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 py-1.5 cursor-pointer"
                >
                  View Full Details
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenChatWithCourse(course.name)}
                    title="Ask AI about this course"
                    className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onOpenEnquiryForCourse(course.name)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Enquire
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No courses match your criteria</h4>
            <p className="text-xs text-slate-500 mt-1">Try resetting the search filter or ask our AI Assistant</p>
            <button
              onClick={() => { setSelectedDegree('All'); setSelectedDepartment('All'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Course Detail Modal */}
      {detailedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDetailedCourse(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              {/* Top metadata */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold">
                    {detailedCourse.degree}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{detailedCourse.code}</span>
                  <span className="text-xs text-slate-500">• {detailedCourse.department}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">
                  {detailedCourse.name}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {detailedCourse.description}
              </p>

              {/* Highlights & Stats */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Duration</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{detailedCourse.duration}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Annual Tuition</div>
                  <div className="text-sm font-bold text-indigo-600 mt-0.5">₹{detailedCourse.feesPerYear.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Verified Intake</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{detailedCourse.seats} Seats</div>
                </div>
              </div>

              {/* Eligibility */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Eligibility Criteria</h4>
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 font-medium leading-relaxed">
                  {detailedCourse.eligibility}
                </div>
              </div>

              {/* Curriculum Highlights */}
              {detailedCourse.curriculumHighlights.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Curriculum & Lab Highlights</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {detailedCourse.curriculumHighlights.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Prospects */}
              {detailedCourse.careerProspects.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Career & Placement Pathways</h4>
                  <div className="flex flex-wrap gap-2">
                    {detailedCourse.careerProspects.map((career, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Campus Locations Offered */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Campus Locations</h4>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {(detailedCourse.campuses && detailedCourse.campuses.length > 0 ? detailedCourse.campuses : ['Main Campus (Tech Valley)']).map((camp, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{camp}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Dedicated lab spaces, smart classrooms, & on-campus hostel
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal footer actions */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-3 justify-end">
                <button
                  onClick={() => {
                    const cname = detailedCourse.name;
                    setDetailedCourse(null);
                    onOpenChatWithCourse(cname);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Bot className="w-4 h-4" />
                  Ask AI About Syllabus & Cutoffs
                </button>
                <button
                  onClick={() => {
                    const cname = detailedCourse.name;
                    setDetailedCourse(null);
                    onOpenEnquiryForCourse(cname);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Submit Admission Enquiry
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};
