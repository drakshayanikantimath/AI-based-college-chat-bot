import { CollegeInfo, Campus, Course, FAQ, Enquiry, KnowledgeDocument, User, DashboardStats } from '../types';

const TOKEN_KEY = 'campus_auth_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Public
  getCollegeProfile: () => request<{ success: boolean; data: CollegeInfo }>('/college/profile'),
  getCampuses: () => request<{ success: boolean; count: number; data: Campus[] }>('/campuses'),
  getCampusById: (id: string) => request<{ success: boolean; data: Campus }>(`/campuses/${id}`),

  getCourses: (params?: { degree?: string; department?: string; campus?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.degree) q.set('degree', params.degree);
    if (params?.department) q.set('department', params.department);
    if (params?.campus) q.set('campus', params.campus);
    if (params?.search) q.set('search', params.search);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return request<{ success: boolean; count: number; data: Course[] }>(`/courses${qs}`);
  },
  getCourseById: (id: string) => request<{ success: boolean; data: Course }>(`/courses/${id}`),
  getFAQs: (params?: { category?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.search) q.set('search', params.search);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return request<{ success: boolean; count: number; data: FAQ[] }>(`/faqs${qs}`);
  },

  // AI Chat
  sendChatMessage: (body: { message: string; sessionId?: string; history?: any[]; campus?: string }) =>
    request<{
      success: boolean;
      answer: string;
      sources: string[];
      suggestedFollowUps?: string[];
      confidence: 'verified' | 'unverified' | 'general';
      sessionId: string;
      campus?: string;
    }>('/chat', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // Student Enquiry
  submitEnquiry: (data: {
    studentName: string;
    email: string;
    phone: string;
    campus?: string;
    courseOfInterest: string;
    category: string;
    message: string;
    preferredContact: string;
    consent: boolean;
  }) =>
    request<{ success: boolean; message: string; refNumber: string; data: Enquiry }>('/enquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  lookupEnquiry: (refNumber: string) =>
    request<{ success: boolean; data: Enquiry }>(`/enquiries/lookup/${encodeURIComponent(refNumber)}`),

  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<{ success: boolean; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  logout: () =>
    request<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' }),
  getCurrentUser: () => request<{ success: boolean; user: User }>('/auth/me'),

  // Admin APIs
  getDashboardStats: () => request<{ success: boolean; data: DashboardStats }>('/admin/dashboard'),
  
  getAdminEnquiries: (params?: { search?: string; category?: string; campus?: string; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set('search', params.search);
    if (params?.category) q.set('category', params.category);
    if (params?.campus) q.set('campus', params.campus);
    if (params?.status) q.set('status', params.status);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return request<{ success: boolean; count: number; data: Enquiry[] }>(`/admin/enquiries${qs}`);
  },

  updateEnquiry: (id: string, updates: { status?: string; internalNotes?: string }) =>
    request<{ success: boolean; data: Enquiry }>(`/admin/enquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  deleteEnquiry: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/enquiries/${id}`, { method: 'DELETE' }),

  exportEnquiriesCsv: () => {
    const token = tokenStorage.get();
    window.location.href = `/api/admin/enquiries/export?token=${token}`;
  },

  // Admin Campuses
  getAdminCampuses: () => request<{ success: boolean; data: Campus[] }>('/admin/campuses'),
  createCampus: (data: Partial<Campus>) =>
    request<{ success: boolean; data: Campus }>('/admin/campuses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCampus: (id: string, data: Partial<Campus>) =>
    request<{ success: boolean; data: Campus }>(`/admin/campuses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCampus: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/campuses/${id}`, { method: 'DELETE' }),

  // Admin Courses
  getAdminCourses: () => request<{ success: boolean; data: Course[] }>('/admin/courses'),
  createCourse: (data: Partial<Course>) =>
    request<{ success: boolean; data: Course }>('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCourse: (id: string, data: Partial<Course>) =>
    request<{ success: boolean; data: Course }>(`/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCourse: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/courses/${id}`, { method: 'DELETE' }),

  // Admin FAQs
  getAdminFAQs: () => request<{ success: boolean; data: FAQ[] }>('/admin/faqs'),
  createFAQ: (data: Partial<FAQ>) =>
    request<{ success: boolean; data: FAQ }>('/admin/faqs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateFAQ: (id: string, data: Partial<FAQ>) =>
    request<{ success: boolean; data: FAQ }>(`/admin/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteFAQ: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/faqs/${id}`, { method: 'DELETE' }),

  // Admin College Info
  updateCollegeInfo: (data: Partial<CollegeInfo>) =>
    request<{ success: boolean; data: CollegeInfo }>('/admin/college-info', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Knowledge Documents
  getKnowledgeDocs: () => request<{ success: boolean; data: KnowledgeDocument[] }>('/admin/knowledge/documents'),
  createKnowledgeDoc: (formData: FormData) =>
    request<{ success: boolean; message: string; data: KnowledgeDocument }>('/admin/knowledge/documents', {
      method: 'POST',
      body: formData,
    }),
  reprocessKnowledgeDoc: (id: string) =>
    request<{ success: boolean; message: string; data: KnowledgeDocument }>(`/admin/knowledge/documents/${id}/reprocess`, {
      method: 'POST',
    }),
  deleteKnowledgeDoc: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/knowledge/documents/${id}`, {
      method: 'DELETE',
    }),

  // Chat logs
  getChatLogs: () => request<{ success: boolean; data: any[] }>('/admin/chat-logs'),
};
