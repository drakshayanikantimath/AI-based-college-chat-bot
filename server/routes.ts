import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import crypto from 'node:crypto';
import { db, hashPassword } from './db.ts';
import { generateRAGAnswer } from './rag.ts';

export const apiRouter = Router();

// Multer memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Simple secure session token storage
const sessions = new Map<string, { userId: string; role: string; expiresAt: number }>();

function generateToken(userId: string, role: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  // 7 days expiration
  sessions.set(token, {
    userId,
    role,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  return token;
}

// Authentication middleware
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'staff';
  };
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Authentication token is required' });
    return;
  }

  const token = authHeader.substring(7);
  const session = sessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) sessions.delete(token);
    res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
    return;
  }

  const user = db.getUserById(session.userId);
  if (!user || !user.isActive) {
    res.status(403).json({ error: 'Forbidden: User is deactivated or not found' });
    return;
  }

  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  next();
}

// ---------------- PUBLIC APIS ----------------

// 1. College profile
apiRouter.get('/college/profile', (req: Request, res: Response) => {
  const info = db.getCollegeInfo();
  res.json({ success: true, data: info });
});

// 2. Campuses listing
apiRouter.get('/campuses', (req: Request, res: Response) => {
  const campuses = db.getCampuses();
  res.json({ success: true, count: campuses.length, data: campuses });
});

apiRouter.get('/campuses/:id', (req: Request, res: Response) => {
  const campus = db.getCampusById(req.params.id);
  if (!campus) {
    res.status(404).json({ error: 'Campus not found' });
    return;
  }
  res.json({ success: true, data: campus });
});

// 3. Public contact
apiRouter.get('/college/contact', (req: Request, res: Response) => {
  const info = db.getCollegeInfo();
  const campuses = db.getCampuses();
  res.json({
    success: true,
    data: {
      collegeName: info.collegeName,
      address: info.address,
      city: info.city,
      state: info.state,
      pincode: info.pincode,
      email: info.email,
      phone: info.phone,
      admissionEmail: info.admissionEmail,
      admissionPhone: info.admissionPhone,
      website: info.website,
      workingHours: info.workingHours,
      campuses: campuses.map(c => ({
        id: c.id,
        name: c.name,
        shortName: c.shortName,
        address: c.address,
        phone: c.phone,
        email: c.email,
        isMain: c.isMain,
      })),
    },
  });
});

// 4. Courses listing with optional campus filter
apiRouter.get('/courses', (req: Request, res: Response) => {
  const { degree, department, campus, search } = req.query;
  const courses = db.getCourses({
    activeOnly: true,
    degree: degree as string,
    department: department as string,
    campus: campus as string,
    search: search as string,
  });
  res.json({ success: true, count: courses.length, data: courses });
});

// 5. Single course
apiRouter.get('/courses/:id', (req: Request, res: Response) => {
  const course = db.getCourseById(req.params.id);
  if (!course) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }
  res.json({ success: true, data: course });
});

// 5. FAQs
apiRouter.get('/faqs', (req: Request, res: Response) => {
  const { category, search } = req.query;
  const faqs = db.getFAQs({
    activeOnly: true,
    category: category as string,
    search: search as string,
  });
  res.json({ success: true, count: faqs.length, data: faqs });
});

// 6. AI Chatbot endpoint
apiRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, sessionId, history, campus } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: 'Query message cannot be empty' });
      return;
    }

    const trimmedMessage = message.trim();
    const effectiveSessionId = sessionId || `sess-${Date.now()}`;

    // Generate answer using RAG + Gemini with selected campus context
    const result = await generateRAGAnswer(trimmedMessage, history || [], campus);

    // Record in chat logs for administrative analytics
    db.logChat({
      sessionId: effectiveSessionId,
      userMessage: trimmedMessage,
      aiResponse: result.answer,
      sources: result.sources,
      category: campus || 'General',
    });

    res.json({
      success: true,
      answer: result.answer,
      sources: result.sources,
      suggestedFollowUps: result.suggestedFollowUps,
      confidence: result.confidence,
      sessionId: effectiveSessionId,
      campus: campus || 'All Campuses',
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({
      error: 'An error occurred while generating chatbot response',
      message: err?.message || 'Internal server error',
    });
  }
});

// 7. Student Enquiry Submission
apiRouter.post('/enquiries', (req: Request, res: Response) => {
  try {
    const {
      studentName,
      email,
      phone,
      campus,
      courseOfInterest,
      category,
      message,
      preferredContact,
      consent,
    } = req.body;

    // Server-side validation
    if (!studentName || !studentName.trim()) {
      res.status(400).json({ error: 'Student name is required' });
      return;
    }

    if (!email || !email.includes('@')) {
      res.status(400).json({ error: 'A valid email address is required' });
      return;
    }

    if (!message || message.trim().length < 10) {
      res.status(400).json({ error: 'Please enter a message or question of at least 10 characters' });
      return;
    }

    if (!consent) {
      res.status(400).json({ error: 'Consent to privacy notice is required to process your enquiry' });
      return;
    }

    const enquiry = db.createEnquiry({
      studentName: studentName.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      campus: (campus || 'Main Campus (Tech Valley)').trim(),
      courseOfInterest: (courseOfInterest || 'General').trim(),
      category: category || 'General enquiry',
      message: message.trim(),
      preferredContact: preferredContact || 'Email',
    });

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been successfully submitted to the admissions office.',
      refNumber: enquiry.refNumber,
      data: enquiry,
    });
  } catch (err: any) {
    console.error('Error in /api/enquiries:', err);
    res.status(500).json({ error: 'Failed to record student enquiry' });
  }
});

// 8. Student Enquiry Status Lookup
apiRouter.get('/enquiries/lookup/:refNumber', (req: Request, res: Response) => {
  const ref = req.params.refNumber;
  if (!ref) {
    res.status(400).json({ error: 'Reference number is required' });
    return;
  }

  const enq = db.getEnquiryByRef(ref);
  if (!enq) {
    res.status(404).json({ error: 'No enquiry found with this reference number. Please check the spelling.' });
    return;
  }

  // Return safe sanitized info without internal admin notes
  res.json({
    success: true,
    data: {
      refNumber: enq.refNumber,
      studentName: enq.studentName,
      campus: enq.campus || 'Main Campus (Tech Valley)',
      courseOfInterest: enq.courseOfInterest,
      category: enq.category,
      status: enq.status,
      createdAt: enq.createdAt,
      updatedAt: enq.updatedAt,
    },
  });
});

// ---------------- AUTHENTICATION APIS ----------------

// 9. Login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const user = db.getUserByEmail(email);
  if (!user || !user.isActive) {
    res.status(401).json({ error: 'Invalid email or credentials' });
    return;
  }

  const hashed = hashPassword(password);
  if (user.passwordHash !== hashed) {
    res.status(401).json({ error: 'Invalid email or credentials' });
    return;
  }

  const token = generateToken(user.id, user.role);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// 10. Logout
apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    sessions.delete(token);
  }
  res.json({ success: true, message: 'Successfully logged out' });
});

// 11. Me
apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, user: req.user });
});

// ---------------- ADMIN APIS (PROTECTED) ----------------

// 12. Dashboard Statistics
apiRouter.get('/admin/dashboard', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const stats = db.getDashboardStats();
  res.json({ success: true, data: stats });
});

// 13. Enquiries Listing & Filtering
apiRouter.get('/admin/enquiries', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { search, category, campus, status, startDate, endDate } = req.query;
  const enquiries = db.getEnquiries({
    search: search as string,
    category: category as string,
    campus: campus as string,
    status: status as string,
    startDate: startDate as string,
    endDate: endDate as string,
  });
  res.json({ success: true, count: enquiries.length, data: enquiries });
});

// 14. Update Enquiry Status & Internal Notes
apiRouter.patch('/admin/enquiries/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { status, internalNotes } = req.body;
  const updated = db.updateEnquiry(req.params.id, {
    ...(status ? { status } : {}),
    ...(internalNotes !== undefined ? { internalNotes } : {}),
  });

  if (!updated) {
    res.status(404).json({ error: 'Enquiry not found' });
    return;
  }

  res.json({ success: true, data: updated });
});

// 15. Delete Enquiry
apiRouter.delete('/admin/enquiries/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const success = db.deleteEnquiry(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Enquiry not found' });
    return;
  }
  res.json({ success: true, message: 'Enquiry deleted' });
});

// 16. Export Enquiries to CSV
apiRouter.get('/admin/enquiries/export', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const enquiries = db.getEnquiries();
  const headers = ['Ref Number', 'Student Name', 'Email', 'Phone', 'Campus', 'Course', 'Category', 'Status', 'Preferred Contact', 'Message', 'Created At'];
  
  const csvRows = [headers.join(',')];
  for (const e of enquiries) {
    const row = [
      `"${e.refNumber}"`,
      `"${e.studentName.replace(/"/g, '""')}"`,
      `"${e.email}"`,
      `"${e.phone}"`,
      `"${(e.campus || 'Main Campus').replace(/"/g, '""')}"`,
      `"${e.courseOfInterest.replace(/"/g, '""')}"`,
      `"${e.category}"`,
      `"${e.status}"`,
      `"${e.preferredContact}"`,
      `"${e.message.replace(/\n/g, ' ').replace(/"/g, '""')}"`,
      `"${e.createdAt}"`,
    ];
    csvRows.push(row.join(','));
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=college_enquiries.csv');
  res.send(csvRows.join('\n'));
});

// 17. Campuses Management CRUD
apiRouter.get('/admin/campuses', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const campuses = db.getCampuses();
  res.json({ success: true, data: campuses });
});

apiRouter.post('/admin/campuses', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { name, shortName, code, city, state, address, phone, email, establishedYear, areaAcres, highlight, keySpecializations, isMain, isActive } = req.body;
  if (!name || !city || !address) {
    res.status(400).json({ error: 'Campus name, city, and address are required' });
    return;
  }

  const newCampus = db.createCampus({
    name,
    shortName: shortName || name,
    code: code || `AITS-${city.toUpperCase().slice(0, 3)}-0${Math.floor(1 + Math.random() * 9)}`,
    city,
    state: state || 'Karnataka',
    address,
    phone: phone || '+91 (080) 4567-8900',
    email: email || 'campus@apexinstitute.edu',
    establishedYear: Number(establishedYear) || 2020,
    areaAcres: Number(areaAcres) || 20,
    highlight: highlight || '',
    keySpecializations: Array.isArray(keySpecializations) ? keySpecializations : [],
    isMain: isMain === true,
    isActive: isActive !== false,
  });

  res.status(201).json({ success: true, data: newCampus });
});

apiRouter.put('/admin/campuses/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateCampus(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Campus not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

apiRouter.delete('/admin/campuses/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const deleted = db.deleteCampus(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Campus not found' });
    return;
  }
  res.json({ success: true, message: 'Campus deleted successfully' });
});

// 18. Courses Management CRUD
apiRouter.get('/admin/courses', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const courses = db.getCourses();
  res.json({ success: true, data: courses });
});

apiRouter.post('/admin/courses', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { name, code, degree, department, duration, eligibility, seats, feesPerYear, description, curriculumHighlights, careerProspects, campuses, isActive } = req.body;
  if (!name || !degree || !department) {
    res.status(400).json({ error: 'Course name, degree, and department are required' });
    return;
  }

  const newCourse = db.createCourse({
    name,
    code: code || `CRS-${Math.floor(100 + Math.random() * 900)}`,
    degree,
    department,
    duration: duration || '4 Years',
    eligibility: eligibility || '10+2 with minimum required marks',
    seats: Number(seats) || 60,
    feesPerYear: Number(feesPerYear) || 100000,
    currency: 'INR',
    description: description || '',
    curriculumHighlights: Array.isArray(curriculumHighlights) ? curriculumHighlights : [],
    careerProspects: Array.isArray(careerProspects) ? careerProspects : [],
    campuses: Array.isArray(campuses) && campuses.length > 0 ? campuses : ['Main Campus (Tech Valley)'],
    isActive: isActive !== false,
  });

  res.status(201).json({ success: true, data: newCourse });
});

apiRouter.put('/admin/courses/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateCourse(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

apiRouter.delete('/admin/courses/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const deleted = db.deleteCourse(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }
  res.json({ success: true, message: 'Course deleted successfully' });
});

// 18. FAQ Management CRUD
apiRouter.get('/admin/faqs', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const faqs = db.getFAQs();
  res.json({ success: true, data: faqs });
});

apiRouter.post('/admin/faqs', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { question, answer, category, displayOrder, isActive } = req.body;
  if (!question || !answer) {
    res.status(400).json({ error: 'Question and answer are required' });
    return;
  }

  const newFaq = db.createFAQ({
    question,
    answer,
    category: category || 'General',
    displayOrder: Number(displayOrder) || 1,
    isActive: isActive !== false,
  });

  res.status(201).json({ success: true, data: newFaq });
});

apiRouter.put('/admin/faqs/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateFAQ(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'FAQ not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

apiRouter.delete('/admin/faqs/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const deleted = db.deleteFAQ(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'FAQ not found' });
    return;
  }
  res.json({ success: true, message: 'FAQ deleted' });
});

// 19. College Info Settings Management
apiRouter.get('/admin/college-info', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const info = db.getCollegeInfo();
  res.json({ success: true, data: info });
});

apiRouter.put('/admin/college-info', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateCollegeInfo(req.body);
  res.json({ success: true, data: updated });
});

// 20. Knowledge Base Management & Document Ingestion
apiRouter.get('/admin/knowledge/documents', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const docs = db.getKnowledgeDocuments();
  res.json({ success: true, data: docs });
});

// Upload document (via file or direct text)
apiRouter.post(
  '/admin/knowledge/documents',
  requireAuth,
  upload.single('file'),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      let content = req.body.content || '';
      let fileName = req.body.fileName || 'manual_entry.txt';
      let fileType = req.body.fileType || 'text/plain';

      if (req.file) {
        fileName = req.file.originalname;
        fileType = req.file.mimetype;
        // Text-based decoding
        content = req.file.buffer.toString('utf-8');
      }

      const title = req.body.title || fileName.replace(/\.[^/.]+$/, '');
      const category = req.body.category || 'General';

      if (!content || content.trim().length < 20) {
        res.status(400).json({ error: 'Document content must contain at least 20 characters of verifiable text' });
        return;
      }

      const result = db.addKnowledgeDocument({
        title,
        category,
        fileName,
        fileType,
        content,
      });

      res.status(201).json({
        success: true,
        message: `Successfully ingested "${result.document.title}" into ${result.chunks.length} searchable knowledge chunks`,
        data: result.document,
      });
    } catch (err: any) {
      console.error('Error adding knowledge document:', err);
      res.status(500).json({ error: 'Failed to process document' });
    }
  }
);

apiRouter.post('/admin/knowledge/documents/:id/reprocess', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const doc = db.reprocessKnowledgeDocument(req.params.id);
  if (!doc) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }
  res.json({ success: true, message: 'Document re-chunked and indexed successfully', data: doc });
});

apiRouter.delete('/admin/knowledge/documents/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const success = db.deleteKnowledgeDocument(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }
  res.json({ success: true, message: 'Document and its searchable index deleted' });
});

// 21. Inspect Recent Chat Logs
apiRouter.get('/admin/chat-logs', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const logs = db.getChatLogs(100);
  res.json({ success: true, data: logs });
});
