import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'staff';
  isActive: boolean;
  createdAt: string;
}

export interface CollegeInfo {
  id: string;
  collegeName: string;
  tagline: string;
  description: string;
  vision: string;
  mission: string;
  accreditation: string[];
  ranking: string;
  establishedYear: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  phone: string;
  website: string;
  admissionEmail: string;
  admissionPhone: string;
  workingHours: string;
  updatedAt: string;
}

export interface Campus {
  id: string;
  name: string;
  shortName: string;
  code: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  establishedYear: number;
  areaAcres: number;
  highlight: string;
  keySpecializations: string[];
  isMain: boolean;
  isActive: boolean;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  degree: string; // 'B.Tech', 'M.Tech', 'BCA', 'MCA', 'BBA', 'MBA', etc.
  department: string;
  duration: string; // e.g. '4 Years (8 Semesters)'
  eligibility: string;
  seats: number;
  feesPerYear: number;
  currency: string;
  description: string;
  curriculumHighlights: string[];
  careerProspects: string[];
  campuses: string[]; // e.g. ['Main Campus (Tech Valley)', 'City Innovation Campus']
  isActive: boolean;
  updatedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string; // 'Admissions' | 'Fees' | 'Hostel' | 'Placements' | 'Courses' | 'General'
  isActive: boolean;
  displayOrder: number;
  timesAsked: number;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  refNumber: string; // e.g. ENQ-2026-89421
  studentName: string;
  email: string;
  phone: string;
  campus: string; // 'Main Campus (Tech Valley)' | 'City Innovation Campus' | 'Green Hills Tech Campus' | 'Any Campus'
  courseOfInterest: string;
  category: 'Admissions' | 'Courses' | 'Fees' | 'Scholarships' | 'Placements' | 'Hostel' | 'Transportation' | 'General enquiry';
  message: string;
  preferredContact: 'Email' | 'Phone' | 'WhatsApp';
  status: 'pending' | 'in_progress' | 'resolved';
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: string;
  fileName: string;
  fileType: string;
  content: string;
  chunkCount: number;
  status: 'indexed' | 'processing' | 'error';
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeChunk {
  id: string;
  docId: string;
  docTitle: string;
  category: string;
  chunkIndex: number;
  content: string;
  keywords: string[];
  createdAt: string;
}

export interface ChatLog {
  id: string;
  sessionId: string;
  userMessage: string;
  aiResponse: string;
  sources: string[];
  category?: string;
  createdAt: string;
}

export interface DatabaseSchema {
  users: User[];
  collegeInfo: CollegeInfo;
  campuses: Campus[];
  courses: Course[];
  faqs: FAQ[];
  enquiries: Enquiry[];
  knowledgeDocuments: KnowledgeDocument[];
  knowledgeChunks: KnowledgeChunk[];
  chatLogs: ChatLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

// Simple secure password hashing utility using SHA-256 with salt
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_college_secret_salt_2026').digest('hex');
}

// Generate unique reference number like ENQ-2026-78412
export function generateRefNumber(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const year = new Date().getFullYear();
  return `ENQ-${year}-${randomNum}`;
}

export function getInitialSeedCampuses(): Campus[] {
  return [
    {
      id: 'campus-main',
      name: 'Main Campus (Tech Valley)',
      shortName: 'Tech Valley Main',
      code: 'AITS-BLR-01',
      city: 'Bangalore',
      state: 'Karnataka',
      address: 'Campus Road, Tech Valley Knowledge Park, Sector 12, Bangalore 560100',
      phone: '+91 (080) 4567-8900',
      email: 'maincampus@apexinstitute.edu',
      establishedYear: 1998,
      areaAcres: 42,
      highlight: 'Flagship 42-Acre Green Campus with Nvidia GPU Clusters, Central Digital Library & Residential Hostels',
      keySpecializations: ['Computer Science & AI', 'Electronics & VLSI', 'Postgraduate Research'],
      isMain: true,
      isActive: true,
    },
    {
      id: 'campus-city',
      name: 'City Innovation Campus (Indiranagar)',
      shortName: 'City Innovation',
      code: 'AITS-BLR-02',
      city: 'Bangalore',
      state: 'Karnataka',
      address: '80 Feet Road, 4th Block, Indiranagar, Bangalore 560038',
      phone: '+91 (080) 4567-8920',
      email: 'citycampus@apexinstitute.edu',
      establishedYear: 2012,
      areaAcres: 14,
      highlight: 'Downtown Corporate Tech Hub with Direct Metro Access, specializing in MBA, FinTech, and BCA',
      keySpecializations: ['Management (MBA)', 'BCA & Cloud Dev', 'Corporate Incubation'],
      isMain: false,
      isActive: true,
    },
    {
      id: 'campus-greenhills',
      name: 'Green Hills Tech Campus (Electronic City)',
      shortName: 'Electronic City',
      code: 'AITS-BLR-03',
      city: 'Bangalore',
      state: 'Karnataka',
      address: 'Phase 1, Electronic City, Hosur Road, Bangalore 560100',
      phone: '+91 (080) 4567-8940',
      email: 'greenhills@apexinstitute.edu',
      establishedYear: 2018,
      areaAcres: 25,
      highlight: 'Advanced hardware fabrication labs, autonomous robotics testing grounds, and IoT MakerSpace',
      keySpecializations: ['Robotics & Automation', 'AI & Data Science', 'Semiconductors'],
      isMain: false,
      isActive: true,
    },
  ];
}

// Initial robust seed data
function getInitialSeedData(): DatabaseSchema {
  const now = new Date().toISOString();
  const campuses = getInitialSeedCampuses();

  const collegeInfo: CollegeInfo = {
    id: 'col-main',
    collegeName: 'Apex Institute of Technology & Science',
    tagline: 'Empowering Minds, Innovating Futures Since 1998',
    description: 'Apex Institute of Technology & Science (AITS) is a premier higher education institution renowned for world-class engineering, computing, management, and scientific research. With state-of-the-art laboratories, experienced faculty, and global corporate ties, we cultivate next-generation leaders and innovators.',
    vision: 'To emerge as a world-renowned center of excellence in multidisciplinary education, pioneering research, and holistic student development.',
    mission: 'To impart cutting-edge technical and managerial education with strong ethical foundations, foster innovation and entrepreneurship, and bridge the gap between academia and global industry.',
    accreditation: ['NAAC A++ Grade (CGPA 3.82)', 'NBA Tier-1 Accredited', 'AICTE Approved', 'Affiliated with State Technical University'],
    ranking: 'Ranked #24 Nationwide in NIRF Engineering Rankings 2025',
    establishedYear: 1998,
    address: 'Campus Road, Tech Valley Knowledge Park, Sector 12',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560100',
    email: 'info@apexinstitute.edu',
    phone: '+91 (080) 4567-8900',
    website: 'https://apexinstitute.edu',
    admissionEmail: 'admissions@apexinstitute.edu',
    admissionPhone: '+91 (080) 4567-8901 / Toll-Free: 1800-200-APEX',
    workingHours: 'Monday – Saturday: 9:00 AM – 5:30 PM (Admissions Desk Open till 6:00 PM)',
    updatedAt: now,
  };

  const users: User[] = [
    {
      id: 'usr-admin-1',
      name: 'Dr. Sarah Jenkins',
      email: 'admin@college.edu',
      passwordHash: hashPassword('admin123'),
      role: 'admin',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'usr-staff-1',
      name: 'Admissions Officer Marcus',
      email: 'admissions@college.edu',
      passwordHash: hashPassword('admit2026'),
      role: 'staff',
      isActive: true,
      createdAt: now,
    },
  ];

  const courses: Course[] = [
    {
      id: 'crs-1',
      name: 'B.Tech in Computer Science & Engineering',
      code: 'CSE-101',
      degree: 'B.Tech',
      department: 'Computer Science & Engineering',
      duration: '4 Years (8 Semesters)',
      eligibility: '10+2 with Physics, Mathematics, and Chemistry/Computer Science with minimum 60% aggregate marks. Valid score in JEE Main or State CET.',
      seats: 180,
      feesPerYear: 165000,
      currency: 'INR',
      description: 'Comprehensive program covering Data Structures, Algorithms, Cloud Computing, AI & Machine Learning, Distributed Systems, and Cybersecurity. Includes mandatory industry internships and capstone projects.',
      curriculumHighlights: ['AI & Neural Networks Lab', 'Cloud Infrastructure with AWS/GCP', 'DevOps & Full Stack Architecture', 'Cyber Defense Systems'],
      careerProspects: ['Software Development Engineer', 'AI/ML Engineer', 'Cloud Architect', 'Cybersecurity Specialist'],
      campuses: ['Main Campus (Tech Valley)', 'Green Hills Tech Campus (Electronic City)'],
      isActive: true,
      updatedAt: now,
    },
    {
      id: 'crs-2',
      name: 'B.Tech in Artificial Intelligence & Data Science',
      code: 'AIDS-102',
      degree: 'B.Tech',
      department: 'Computer Science & Engineering',
      duration: '4 Years (8 Semesters)',
      eligibility: '10+2 with Physics, Mathematics, and Chemistry with minimum 60% aggregate. Valid score in State CET or JEE Main.',
      seats: 120,
      feesPerYear: 175000,
      currency: 'INR',
      description: 'Dedicated curriculum in Deep Learning, Natural Language Processing, Computer Vision, Big Data Analytics, and Responsible AI systems.',
      curriculumHighlights: ['Generative AI Laboratory', 'Big Data Engineering with Spark/Hadoop', 'Applied Machine Learning', 'Computer Vision & Robotics'],
      careerProspects: ['Data Scientist', 'Machine Learning Engineer', 'BI Analyst', 'Prompt Engineer & NLP Researcher'],
      campuses: ['Main Campus (Tech Valley)', 'Green Hills Tech Campus (Electronic City)'],
      isActive: true,
      updatedAt: now,
    },
    {
      id: 'crs-3',
      name: 'B.Tech in Electronics & Communication Engineering',
      code: 'ECE-103',
      degree: 'B.Tech',
      department: 'Electronics & Communication',
      duration: '4 Years (8 Semesters)',
      eligibility: '10+2 with Physics, Chemistry, and Mathematics with minimum 55% aggregate marks.',
      seats: 120,
      feesPerYear: 140000,
      currency: 'INR',
      description: 'Covers VLSI Design, Embedded Systems, IoT, 5G Wireless Communications, and Signal Processing with industry standard EDA tool suites.',
      curriculumHighlights: ['VLSI Cadence/Synopsys Lab', 'Embedded IoT Systems with ARM Cortex', 'RF & Microwave Engineering', 'Robotics Hardware'],
      careerProspects: ['VLSI Design Engineer', 'Embedded Firmware Engineer', 'Telecom Specialist', 'Hardware Systems Engineer'],
      campuses: ['Main Campus (Tech Valley)', 'Green Hills Tech Campus (Electronic City)'],
      isActive: true,
      updatedAt: now,
    },
    {
      id: 'crs-4',
      name: 'M.Tech in Computer Science (Artificial Intelligence)',
      code: 'MCSE-201',
      degree: 'M.Tech',
      department: 'Computer Science & Engineering',
      duration: '2 Years (4 Semesters)',
      eligibility: 'B.E./B.Tech in CSE, IT, or allied branch with minimum 60% aggregate. Valid GATE score preferred.',
      seats: 30,
      feesPerYear: 120000,
      currency: 'INR',
      description: 'Advanced research-driven postgraduate degree with focus on Deep Reinforcement Learning, Autonomous Agents, and Quantum Computing basics.',
      curriculumHighlights: ['Research Thesis with Scopus/IEEE publications', 'High-Performance GPU Cluster Access', 'Industry Co-Supervised Projects'],
      careerProspects: ['Senior AI Researcher', 'Principal Architect', 'Data Science Lead', 'Doctoral Studies/PhD'],
      campuses: ['Main Campus (Tech Valley)'],
      isActive: true,
      updatedAt: now,
    },
    {
      id: 'crs-5',
      name: 'Master of Business Administration (MBA)',
      code: 'MBA-301',
      degree: 'MBA',
      department: 'Management Studies',
      duration: '2 Years (4 Semesters)',
      eligibility: 'Graduation in any discipline with minimum 50% aggregate marks. Valid CAT / MAT / CMAT / XAT score.',
      seats: 120,
      feesPerYear: 195000,
      currency: 'INR',
      description: 'Dual specialization in Marketing, Finance, Human Resources, Business Analytics, and Operations. Features Harvard Business School case studies and executive mentoring.',
      curriculumHighlights: ['Global Business Simulation Labs', 'FinTech & Analytics Specialization', 'Live Industry Consulting Projects', 'Leadership Immersion'],
      careerProspects: ['Investment Banker', 'Product Manager', 'Management Consultant', 'HR Business Partner'],
      campuses: ['City Innovation Campus (Indiranagar)', 'Main Campus (Tech Valley)'],
      isActive: true,
      updatedAt: now,
    },
    {
      id: 'crs-6',
      name: 'Bachelor of Computer Applications (BCA)',
      code: 'BCA-104',
      degree: 'BCA',
      department: 'Information Technology',
      duration: '3 Years (6 Semesters)',
      eligibility: '10+2 with Mathematics/Computer Applications/Business Math with minimum 50% aggregate marks.',
      seats: 90,
      feesPerYear: 95000,
      currency: 'INR',
      description: 'Hands-on application development degree emphasizing web development, mobile apps, database management, and cloud basics.',
      curriculumHighlights: ['Modern JavaScript & React', 'Relational & NoSQL Databases', 'Mobile App Development (Flutter/React Native)', 'Agile Methodologies'],
      careerProspects: ['Full Stack Web Developer', 'Database Administrator', 'Application Support Specialist', 'QA Engineer'],
      campuses: ['City Innovation Campus (Indiranagar)', 'Main Campus (Tech Valley)'],
      isActive: true,
      updatedAt: now,
    },
  ];

  const faqs: FAQ[] = [
    {
      id: 'faq-1',
      question: 'What is the admission procedure for B.Tech courses for the 2026-27 academic session?',
      answer: 'Admission for B.Tech is conducted through two channels: (1) Merit-based state counselling based on JEE Main / CET ranks, and (2) Management quota / Institutional merit based on 10+2 PCM scores and entrance test. Online application opens on May 1st, 2026, and closes on June 30th, 2026. Applicants must submit 10th & 12th marks cards, identity proof, and transfer certificate.',
      category: 'Admissions',
      isActive: true,
      displayOrder: 1,
      timesAsked: 142,
      updatedAt: now,
    },
    {
      id: 'faq-2',
      question: 'What is the annual fee structure and are installment options available?',
      answer: 'Tuition fees vary by program: B.Tech CSE is ₹1,65,000/year; B.Tech AI & DS is ₹1,75,000/year; B.Tech ECE is ₹1,40,000/year; BCA is ₹95,000/year; MBA is ₹1,95,000/year. Fees can be paid in two equal semester installments. Examination and lab security deposits (refundable ₹10,000) are charged in the first semester.',
      category: 'Fees',
      isActive: true,
      displayOrder: 2,
      timesAsked: 198,
      updatedAt: now,
    },
    {
      id: 'faq-3',
      question: 'Are scholarships available for meritorious or economically disadvantaged students?',
      answer: 'Yes! Apex offers generous scholarships: (1) Meritorious Scholarship: 50% tuition waiver for 10+2 aggregate > 95%, 25% waiver for 90-95%. (2) Sports Excellence Scholarship: 30% waiver for national/state level champions. (3) Economically Weaker Section (EWS) assistance for family income below ₹3.5 LPA. (4) Defense personnel wards receive a 15% concession.',
      category: 'Scholarships',
      isActive: true,
      displayOrder: 3,
      timesAsked: 167,
      updatedAt: now,
    },
    {
      id: 'faq-4',
      question: 'What are the campus placement records and highest package offered?',
      answer: 'In the 2024-25 placement drive, over 94% of eligible students secured placements across 220+ recruiting companies. The highest international package was ₹52 LPA, highest domestic package was ₹38 LPA, and the average salary package across engineering branches was ₹8.6 LPA. Key recruiters include Microsoft, Amazon, Google, Cisco, TCS Digital, Infosys, and Deloitte.',
      category: 'Placements',
      isActive: true,
      displayOrder: 4,
      timesAsked: 220,
      updatedAt: now,
    },
    {
      id: 'faq-5',
      question: 'What hostel and accommodation facilities are available on campus?',
      answer: 'We have separate multi-story hostels for boys and girls within the secure campus perimeter. Facilities include high-speed Wi-Fi, 24/7 security with CCTV, hot water, hygienic cafeteria providing vegetarian and non-vegetarian meals, gymnasium, reading rooms, and indoor games. Accommodation fees range from ₹85,000 (triple occupancy) to ₹1,15,000 (twin sharing with attached bath) per academic year including mess charges.',
      category: 'Hostel',
      isActive: true,
      displayOrder: 5,
      timesAsked: 115,
      updatedAt: now,
    },
    {
      id: 'faq-6',
      question: 'What documents are required at the time of admission verification?',
      answer: 'Candidates must present: (1) 10th and 12th original mark sheets plus 3 self-attested photocopies; (2) Transfer Certificate (TC) & Migration Certificate; (3) Entrance Exam Score Card (JEE Main/CET); (4) Conduct/Character Certificate; (5) Category / Caste / Income Certificate if claiming quota or scholarship; (6) 6 recent passport-size photographs; (7) Aadhaar Card copy.',
      category: 'Admissions',
      isActive: true,
      displayOrder: 6,
      timesAsked: 89,
      updatedAt: now,
    },
    {
      id: 'faq-7',
      question: 'Is campus transportation available for day scholars across the city?',
      answer: 'Yes, Apex operates a fleet of 35 air-conditioned GPS-tracked buses covering all major zones and transit hubs across the metropolitan area. The annual bus transportation fee is ₹28,000 to ₹36,000 depending on the distance zone. Bus tracking is available live via the campus mobile app.',
      category: 'Transportation',
      isActive: true,
      displayOrder: 7,
      timesAsked: 74,
      updatedAt: now,
    },
    {
      id: 'faq-8',
      question: 'How can I contact the college admission office directly or schedule a campus visit?',
      answer: 'You can reach our Admissions Helpdesk by phone at +91 (080) 4567-8901 or toll-free at 1800-200-APEX. You can also email admissions@apexinstitute.edu. Guided campus tours run every Monday through Saturday at 11:00 AM and 3:00 PM. Visitors may register at the main reception desk.',
      category: 'General',
      isActive: true,
      displayOrder: 8,
      timesAsked: 130,
      updatedAt: now,
    },
  ];

  const enquiries: Enquiry[] = [
    {
      id: 'enq-1',
      refNumber: 'ENQ-2026-92814',
      studentName: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      phone: '+91 9876543210',
      campus: 'Main Campus (Tech Valley)',
      courseOfInterest: 'B.Tech in Computer Science & Engineering',
      category: 'Admissions',
      message: 'I scored 94 percentile in JEE Main and 92% in 12th CBSE. Am I eligible for merit scholarship during admission?',
      preferredContact: 'Email',
      status: 'resolved',
      internalNotes: 'Contacted candidate and confirmed 25% merit scholarship eligibility. Sent scholarship form.',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'enq-2',
      refNumber: 'ENQ-2026-61520',
      studentName: 'Ananya Patel',
      email: 'ananya.p@example.com',
      phone: '+91 9845012345',
      campus: 'Green Hills Tech Campus (Electronic City)',
      courseOfInterest: 'B.Tech in Artificial Intelligence & Data Science',
      category: 'Hostel',
      message: 'Inquiring about girls hostel safety measures, twin sharing availability, and mess food menu options.',
      preferredContact: 'Phone',
      status: 'in_progress',
      internalNotes: 'Warden spoke to parents. Shared hostel brochure and room allotment schedule.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: 'enq-3',
      refNumber: 'ENQ-2026-78190',
      studentName: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      phone: '+91 9711223344',
      campus: 'City Innovation Campus (Indiranagar)',
      courseOfInterest: 'Master of Business Administration (MBA)',
      category: 'Fees',
      message: 'Does the college have tie-ups with nationalized banks for education loan processing with collateral-free options?',
      preferredContact: 'Email',
      status: 'pending',
      internalNotes: '',
      createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    },
    {
      id: 'enq-4',
      refNumber: 'ENQ-2026-34019',
      studentName: 'Sneha Kulkarni',
      email: 'sneha.k@example.com',
      phone: '+91 9988776655',
      campus: 'City Innovation Campus (Indiranagar)',
      courseOfInterest: 'BCA',
      category: 'Scholarships',
      message: 'State level badminton player inquiring if sports quota scholarship applies to undergraduate BCA programs.',
      preferredContact: 'WhatsApp',
      status: 'pending',
      internalNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Verified official college documents for RAG
  const doc1Content = `APEX INSTITUTE OF TECHNOLOGY & SCIENCE - OFFICIAL ADMISSION BROCHURE 2026-27

1. GENERAL ELIGIBILITY CRITERIA
Candidates applying for undergraduate engineering (B.Tech) programs must have completed 10+2 examinations recognized by the State or Central Board with minimum 60% aggregate in Physics, Mathematics, and Chemistry/Computer Science.
Candidates applying for BCA must have 50% aggregate with Mathematics or Computer Applications in 10+2.
Candidates applying for Postgraduate (M.Tech) must possess a recognized B.Tech/B.E degree with 60% marks and a valid GATE score or Institute Entrance Test score.
MBA candidates must possess a 3-year bachelor's degree in any stream with at least 50% aggregate marks and scores in CAT/MAT/CMAT.

2. ADMISSION SCHEDULE & DEADLINES (2026-27)
- Application Portal Opens: May 1, 2026
- Early Bird Merit Application Deadline: June 15, 2026
- Final Application Submission Deadline: June 30, 2026
- Counseling & Document Verification: July 5 - July 15, 2026
- Academic Session Orientation & Commencement: August 3, 2026
Important Notice: All dates are subject to regulatory approvals. Late submissions are not permitted without express written consent of the Admissions Registrar.

3. REQUIRED DOCUMENTS CHECKLIST
Originals and 3 sets of attested copies are required:
- Class 10th Secondary School Certificate (Proof of Date of Birth)
- Class 12th Higher Secondary Marks Sheet
- Transfer Certificate (TC) issued by the last attended school/college
- Migration Certificate (for students outside the home state)
- Conduct / Character Certificate
- Rank Card & Admit Card of qualifying entrance examination (JEE Main / State CET)
- Caste / Community / Income Certificate (if applicable)
- 6 recent colored passport-size photographs
- Government issued Photo ID (Aadhaar Card or Passport)`;

  const doc2Content = `APEX INSTITUTE OF TECHNOLOGY & SCIENCE - FEE STRUCTURE & FINANCIAL AID POLICY 2026-27

1. ANNUAL TUITION FEES
- B.Tech Computer Science & Engineering (CSE): INR 1,65,000 per academic year.
- B.Tech Artificial Intelligence & Data Science (AI & DS): INR 1,75,000 per academic year.
- B.Tech Electronics & Communication Engineering (ECE): INR 1,40,000 per academic year.
- Bachelor of Computer Applications (BCA): INR 95,000 per academic year.
- Master of Technology (M.Tech CSE): INR 1,20,000 per academic year.
- Master of Business Administration (MBA): INR 1,95,000 per academic year.

2. OTHER MANDATORY ONE-TIME CHARGES
- Registration & Orientation Fee: INR 5,000 (Non-refundable, paid once at admission).
- Refundable Caution & Security Deposit: INR 10,000 (Refundable upon course completion).
- Annual University Exam & Regulatory Fee: INR 6,000 per year.

3. SCHOLARSHIP SCHEMES (MERIT & NEED BASED)
- Chairman's Merit Waiver: 50% tuition waiver for students scoring 95% and above in 10+2 PCM.
- Academic Excellence Award: 25% tuition waiver for 90% to 94.9% in 10+2 PCM.
- Sports Achiever Scholarship: 30% waiver for state/national tournament medalists.
- Economically Weaker Section (EWS): Up to 50% need-based fee subsidy for families with annual income < INR 3,50,000.
- Defense & Paramilitary Wards Concession: 15% discount on annual tuition.
- Sibling Concession: 10% fee reduction if an elder sibling is actively enrolled at AITS.

4. PAYMENT TERMS & EDUCATION LOANS
- Fees may be paid in two equal installments per semester.
- College has tie-ups with State Bank of India, HDFC Bank, and Canara Bank for pre-approved, collateral-free education loans up to INR 7.5 Lakhs with special student interest concessions.`;

  const doc3Content = `APEX INSTITUTE OF TECHNOLOGY & SCIENCE - CAMPUS PLACEMENT REPORT & CORPORATE RELATIONS

1. OVERVIEW OF PLACEMENT ACHIEVEMENTS (ACADEMIC YEAR 2024-25)
- Overall Placement Percentage: 94.2% across engineering and management departments.
- Highest International Salary Package: INR 52.0 Lakhs Per Annum (LPA) by a global cloud software company.
- Highest Domestic Salary Package: INR 38.5 Lakhs Per Annum (LPA).
- Average Package (Overall Institute): INR 8.65 Lakhs Per Annum (LPA).
- Median Package for CSE / AI & DS: INR 10.20 Lakhs Per Annum (LPA).
- Total Job Offers: 640+ offers made to eligible graduating batch.
- Total Recruiters Visiting Campus: 220+ marquee multinational corporations and unicorns.

2. PROMINENT REGULAR RECRUITERS
- Tier-1 Technology: Microsoft, Amazon, Google, Cisco, Adobe, Oracle, Salesforce.
- IT Services & Consulting: Tata Consultancy Services (Digital & Ninja), Infosys, Wipro, Accenture, Cognizant, Deloitte, EY.
- Core Electronics & Semiconductors: Intel, Qualcomm, Texas Instruments, Bosch, Robert Bosch, Schneider Electric.
- FinTech & Banking: Goldman Sachs, JPMorgan Chase, Morgan Stanley, Standard Chartered.

3. TRAINING & PLACEMENT CELL (T&P) SERVICES
- 200+ hours of dedicated aptitude, verbal reasoning, and soft-skills training starting from the 3rd year.
- Competitive coding bootcamp in C++, Java, and Python on LeetCode/HackerRank platforms.
- Mock technical and HR interview rounds conducted by industry alumni.
- Dedicated internship placement drive during the 6th semester leading to Pre-Placement Offers (PPOs).`;

  const doc4Content = `APEX INSTITUTE OF TECHNOLOGY & SCIENCE - CAMPUS INFRASTRUCTURE & HOSTEL FACILITIES

1. RESIDENTIAL HOSTELS
- On-campus separate hostels for boys (500 capacity) and girls (400 capacity) with 24/7 biometric and CCTV monitoring.
- Room Options: Twin Sharing (Attached washroom) at INR 1,15,000/year; Triple Sharing (Common washroom) at INR 85,000/year. All fees include breakfast, lunch, evening snacks, and dinner.
- Amenities: High-speed Wi-Fi (1 Gbps fiber backbone), solar hot water systems, laundry room, silent study halls, indoor badminton/table tennis, and 24/7 on-call doctor and ambulance.

2. CENTRAL LIBRARY & RESEARCH COMMONS
- Over 65,000 printed volumes, 120 national and international print journals.
- Full digital access to IEEE Xplore, ScienceDirect, Springer, ACM Digital Library, and J-GATE.
- Air-conditioned reading area with 300 seating capacity, open from 8:00 AM to 10:00 PM during regular days and 24/7 during examination weeks.

3. COMPUTING & INNOVATION LABS
- 12 high-tech computer labs equipped with Intel Core i7/i9 workstations and Nvidia RTX GPUs.
- Campus-wide Apple Mac Lab for iOS and multimedia development.
- MakerSpace and IoT Fabrication Lab featuring 3D printers, laser cutters, and electronics prototyping stations.

4. HEALTH, SPORTS & TRANSPORTATION
- Medical Center staffed with a resident medical officer and nursing staff.
- Sports complex featuring a full-size cricket/football ground, 400m athletic track, two synthetic basketball courts, and gymnasium.
- 35 AC buses covering 28 routes across the Bengaluru metropolitan region with real-time GPS tracking.`;

  const knowledgeDocuments: KnowledgeDocument[] = [
    {
      id: 'doc-1',
      title: 'Official Admission Brochure & Guidelines 2026-27',
      category: 'Admissions',
      fileName: 'Admission_Brochure_2026.txt',
      fileType: 'text/plain',
      content: doc1Content,
      chunkCount: 3,
      status: 'indexed',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'doc-2',
      title: 'Fee Structure, Installments & Scholarships Policy 2026-27',
      category: 'Fees',
      fileName: 'Fee_Scholarship_Policy_2026.txt',
      fileType: 'text/plain',
      content: doc2Content,
      chunkCount: 4,
      status: 'indexed',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'doc-3',
      title: 'Placement Statistics & Recruiter Report 2024-25',
      category: 'Placements',
      fileName: 'Placement_Report_2024_25.txt',
      fileType: 'text/plain',
      content: doc3Content,
      chunkCount: 3,
      status: 'indexed',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'doc-4',
      title: 'Campus Infrastructure, Hostels & Student Life Guide',
      category: 'Facilities',
      fileName: 'Campus_Facilities_Guide.txt',
      fileType: 'text/plain',
      content: doc4Content,
      chunkCount: 4,
      status: 'indexed',
      createdAt: now,
      updatedAt: now,
    },
  ];

  // Generate chunks from documents
  const knowledgeChunks: KnowledgeChunk[] = [];
  knowledgeDocuments.forEach((doc) => {
    const sections = doc.content.split(/\n\n(?=[0-9]+\. )/);
    sections.forEach((sec, idx) => {
      const words = sec.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3);
      const uniqueKeywords = Array.from(new Set(words)).slice(0, 30);
      knowledgeChunks.push({
        id: `chk-${doc.id}-${idx + 1}`,
        docId: doc.id,
        docTitle: doc.title,
        category: doc.category,
        chunkIndex: idx + 1,
        content: sec.trim(),
        keywords: uniqueKeywords,
        createdAt: now,
      });
    });
  });

  const chatLogs: ChatLog[] = [];

  return {
    users,
    collegeInfo,
    campuses,
    courses,
    faqs,
    enquiries,
    knowledgeDocuments,
    knowledgeChunks,
    chatLogs,
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadDatabase();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(content) as DatabaseSchema;
        let modified = false;

        if (!parsed.campuses || parsed.campuses.length === 0) {
          parsed.campuses = getInitialSeedCampuses();
          modified = true;
        }

        if (parsed.courses) {
          parsed.courses.forEach(c => {
            if (!c.campuses || c.campuses.length === 0) {
              if (c.degree === 'MBA' || c.degree === 'BCA') {
                c.campuses = ['City Innovation Campus (Indiranagar)', 'Main Campus (Tech Valley)'];
              } else {
                c.campuses = ['Main Campus (Tech Valley)', 'Green Hills Tech Campus (Electronic City)'];
              }
              modified = true;
            }
          });
        }

        if (parsed.enquiries) {
          parsed.enquiries.forEach(e => {
            if (!e.campus) {
              e.campus = 'Main Campus (Tech Valley)';
              modified = true;
            }
          });
        }

        if (modified) {
          this.saveDatabaseSync(parsed);
        }

        return parsed;
      }
    } catch (err) {
      console.error('Error reading database file, initializing with seeds:', err);
    }

    const seed = getInitialSeedData();
    this.saveDatabaseSync(seed);
    return seed;
  }

  private saveDatabaseSync(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  public save() {
    this.saveDatabaseSync(this.data);
  }

  // Campuses getters & CRUD
  public getCampuses(): Campus[] {
    return this.data.campuses || [];
  }

  public getCampusById(id: string): Campus | undefined {
    return (this.data.campuses || []).find(c => c.id === id);
  }

  public createCampus(campus: Omit<Campus, 'id'>): Campus {
    const newCampus: Campus = {
      id: `campus-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...campus,
    };
    if (!this.data.campuses) this.data.campuses = [];
    this.data.campuses.push(newCampus);
    this.save();
    return newCampus;
  }

  public updateCampus(id: string, updates: Partial<Campus>): Campus | undefined {
    if (!this.data.campuses) this.data.campuses = [];
    const index = this.data.campuses.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    this.data.campuses[index] = {
      ...this.data.campuses[index],
      ...updates,
    };
    this.save();
    return this.data.campuses[index];
  }

  public deleteCampus(id: string): boolean {
    if (!this.data.campuses) return false;
    const index = this.data.campuses.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.data.campuses.splice(index, 1);
    this.save();
    return true;
  }

  // College Info getters & setters
  public getCollegeInfo(): CollegeInfo {
    return this.data.collegeInfo;
  }

  public updateCollegeInfo(updates: Partial<CollegeInfo>): CollegeInfo {
    this.data.collegeInfo = {
      ...this.data.collegeInfo,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.collegeInfo;
  }

  // Users & Auth
  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      ...user,
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  // Courses
  public getCourses(filter?: { activeOnly?: boolean; department?: string; degree?: string; campus?: string; search?: string }): Course[] {
    let result = this.data.courses;
    if (filter?.activeOnly) {
      result = result.filter(c => c.isActive);
    }
    if (filter?.department) {
      result = result.filter(c => c.department.toLowerCase() === filter.department!.toLowerCase());
    }
    if (filter?.degree) {
      result = result.filter(c => c.degree.toLowerCase() === filter.degree!.toLowerCase());
    }
    if (filter?.campus && filter.campus !== 'All' && filter.campus !== 'All Campuses') {
      const campSearch = filter.campus.toLowerCase();
      result = result.filter(c =>
        !c.campuses ||
        c.campuses.length === 0 ||
        c.campuses.some(camp =>
          camp.toLowerCase().includes(campSearch) ||
          campSearch.includes(camp.toLowerCase()) ||
          camp.toLowerCase() === 'all campuses'
        )
      );
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.campuses && c.campuses.some(camp => camp.toLowerCase().includes(q)))
      );
    }
    return result;
  }

  public getCourseById(id: string): Course | undefined {
    return this.data.courses.find(c => c.id === id);
  }

  public createCourse(course: Omit<Course, 'id' | 'updatedAt'>): Course {
    const newCourse: Course = {
      id: `crs-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      updatedAt: new Date().toISOString(),
      ...course,
    };
    this.data.courses.push(newCourse);
    this.save();
    return newCourse;
  }

  public updateCourse(id: string, updates: Partial<Course>): Course | undefined {
    const index = this.data.courses.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    this.data.courses[index] = {
      ...this.data.courses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.courses[index];
  }

  public deleteCourse(id: string): boolean {
    const index = this.data.courses.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.data.courses.splice(index, 1);
    this.save();
    return true;
  }

  // FAQs
  public getFAQs(filter?: { activeOnly?: boolean; category?: string; search?: string }): FAQ[] {
    let result = this.data.faqs;
    if (filter?.activeOnly) {
      result = result.filter(f => f.isActive);
    }
    if (filter?.category) {
      result = result.filter(f => f.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(f => 
        f.question.toLowerCase().includes(q) || 
        f.answer.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public getFAQById(id: string): FAQ | undefined {
    return this.data.faqs.find(f => f.id === id);
  }

  public createFAQ(faq: Omit<FAQ, 'id' | 'timesAsked' | 'updatedAt'>): FAQ {
    const newFAQ: FAQ = {
      id: `faq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timesAsked: 0,
      updatedAt: new Date().toISOString(),
      ...faq,
    };
    this.data.faqs.push(newFAQ);
    this.save();
    return newFAQ;
  }

  public updateFAQ(id: string, updates: Partial<FAQ>): FAQ | undefined {
    const index = this.data.faqs.findIndex(f => f.id === id);
    if (index === -1) return undefined;
    this.data.faqs[index] = {
      ...this.data.faqs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.faqs[index];
  }

  public deleteFAQ(id: string): boolean {
    const index = this.data.faqs.findIndex(f => f.id === id);
    if (index === -1) return false;
    this.data.faqs.splice(index, 1);
    this.save();
    return true;
  }

  public incrementFAQUsage(id: string): void {
    const item = this.data.faqs.find(f => f.id === id);
    if (item) {
      item.timesAsked = (item.timesAsked || 0) + 1;
      this.save();
    }
  }

  // Enquiries
  public createEnquiry(enquiry: Omit<Enquiry, 'id' | 'refNumber' | 'status' | 'internalNotes' | 'createdAt' | 'updatedAt'>): Enquiry {
    const now = new Date().toISOString();
    const newEnquiry: Enquiry = {
      id: `enq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      refNumber: generateRefNumber(),
      status: 'pending',
      internalNotes: '',
      createdAt: now,
      updatedAt: now,
      ...enquiry,
      campus: enquiry.campus || 'Main Campus (Tech Valley)',
    };
    this.data.enquiries.unshift(newEnquiry);
    this.save();
    return newEnquiry;
  }

  public getEnquiries(filter?: {
    search?: string;
    category?: string;
    campus?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Enquiry[] {
    let result = this.data.enquiries;
    if (filter?.status && filter.status !== 'all') {
      result = result.filter(e => e.status === filter.status);
    }
    if (filter?.category && filter.category !== 'all') {
      result = result.filter(e => e.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter?.campus && filter.campus !== 'all' && filter.campus !== 'All Campuses') {
      result = result.filter(e => e.campus === filter.campus);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(e =>
        e.refNumber.toLowerCase().includes(q) ||
        e.studentName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.campus && e.campus.toLowerCase().includes(q)) ||
        e.phone.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q)
      );
    }
    if (filter?.startDate) {
      result = result.filter(e => e.createdAt >= filter.startDate!);
    }
    if (filter?.endDate) {
      result = result.filter(e => e.createdAt <= filter.endDate!);
    }
    return result;
  }

  public getEnquiryByRef(refNumber: string): Enquiry | undefined {
    return this.data.enquiries.find(e => e.refNumber.trim().toUpperCase() === refNumber.trim().toUpperCase());
  }

  public updateEnquiry(id: string, updates: Partial<Enquiry>): Enquiry | undefined {
    const index = this.data.enquiries.findIndex(e => e.id === id);
    if (index === -1) return undefined;
    this.data.enquiries[index] = {
      ...this.data.enquiries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.enquiries[index];
  }

  public deleteEnquiry(id: string): boolean {
    const index = this.data.enquiries.findIndex(e => e.id === id);
    if (index === -1) return false;
    this.data.enquiries.splice(index, 1);
    this.save();
    return true;
  }

  // Knowledge Documents & Chunks for RAG
  public getKnowledgeDocuments(): KnowledgeDocument[] {
    return this.data.knowledgeDocuments;
  }

  public getKnowledgeDocumentById(id: string): KnowledgeDocument | undefined {
    return this.data.knowledgeDocuments.find(d => d.id === id);
  }

  public addKnowledgeDocument(doc: {
    title: string;
    category: string;
    fileName: string;
    fileType: string;
    content: string;
  }): { document: KnowledgeDocument; chunks: KnowledgeChunk[] } {
    const now = new Date().toISOString();
    const docId = `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Split into chunks (~300-500 words per chunk or paragraph breaks)
    const rawChunks = this.splitContentIntoChunks(doc.content);
    const chunks: KnowledgeChunk[] = rawChunks.map((content, idx) => {
      const words = content.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3);
      const uniqueKeywords = Array.from(new Set(words)).slice(0, 30);
      return {
        id: `chk-${docId}-${idx + 1}`,
        docId,
        docTitle: doc.title,
        category: doc.category,
        chunkIndex: idx + 1,
        content: content.trim(),
        keywords: uniqueKeywords,
        createdAt: now,
      };
    });

    const newDoc: KnowledgeDocument = {
      id: docId,
      title: doc.title,
      category: doc.category,
      fileName: doc.fileName,
      fileType: doc.fileType,
      content: doc.content,
      chunkCount: chunks.length,
      status: 'indexed',
      createdAt: now,
      updatedAt: now,
    };

    this.data.knowledgeDocuments.push(newDoc);
    this.data.knowledgeChunks.push(...chunks);
    this.save();

    return { document: newDoc, chunks };
  }

  public deleteKnowledgeDocument(id: string): boolean {
    const docIdx = this.data.knowledgeDocuments.findIndex(d => d.id === id);
    if (docIdx === -1) return false;
    this.data.knowledgeDocuments.splice(docIdx, 1);
    this.data.knowledgeChunks = this.data.knowledgeChunks.filter(c => c.docId !== id);
    this.save();
    return true;
  }

  public reprocessKnowledgeDocument(id: string): KnowledgeDocument | undefined {
    const doc = this.data.knowledgeDocuments.find(d => d.id === id);
    if (!doc) return undefined;

    // remove existing chunks
    this.data.knowledgeChunks = this.data.knowledgeChunks.filter(c => c.docId !== id);

    // regenerate
    const now = new Date().toISOString();
    const rawChunks = this.splitContentIntoChunks(doc.content);
    const newChunks: KnowledgeChunk[] = rawChunks.map((content, idx) => {
      const words = content.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3);
      const uniqueKeywords = Array.from(new Set(words)).slice(0, 30);
      return {
        id: `chk-${doc.id}-${idx + 1}`,
        docId: doc.id,
        docTitle: doc.title,
        category: doc.category,
        chunkIndex: idx + 1,
        content: content.trim(),
        keywords: uniqueKeywords,
        createdAt: now,
      };
    });

    doc.chunkCount = newChunks.length;
    doc.status = 'indexed';
    doc.updatedAt = now;
    this.data.knowledgeChunks.push(...newChunks);
    this.save();
    return doc;
  }

  private splitContentIntoChunks(text: string): string[] {
    const paragraphs = text.split(/\n\s*\n/);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const p of paragraphs) {
      if ((currentChunk + '\n\n' + p).length > 900 && currentChunk.length > 200) {
        chunks.push(currentChunk.trim());
        currentChunk = p;
      } else {
        currentChunk = currentChunk ? currentChunk + '\n\n' + p : p;
      }
    }
    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }
    return chunks.length > 0 ? chunks : [text];
  }

  public getKnowledgeChunks(): KnowledgeChunk[] {
    return this.data.knowledgeChunks;
  }

  // Chat Logging & Analytics
  public logChat(log: Omit<ChatLog, 'id' | 'createdAt'>): ChatLog {
    const newLog: ChatLog = {
      id: `chat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      ...log,
    };
    this.data.chatLogs.push(newLog);
    // keep max 500 recent chat logs
    if (this.data.chatLogs.length > 500) {
      this.data.chatLogs.shift();
    }
    this.save();
    return newLog;
  }

  public getChatLogs(limit = 100): ChatLog[] {
    return [...this.data.chatLogs].reverse().slice(0, limit);
  }

  // Dashboard Stats
  public getDashboardStats() {
    const todayStr = new Date().toISOString().slice(0, 10);
    const totalEnquiries = this.data.enquiries.length;
    const todayEnquiries = this.data.enquiries.filter(e => e.createdAt.startsWith(todayStr)).length;
    const pendingEnquiries = this.data.enquiries.filter(e => e.status === 'pending').length;
    const resolvedEnquiries = this.data.enquiries.filter(e => e.status === 'resolved').length;
    const totalCourses = this.data.courses.length;
    const totalDocs = this.data.knowledgeDocuments.length;
    const totalChunks = this.data.knowledgeChunks.length;
    const totalFAQs = this.data.faqs.length;

    // Enquiries by category
    const categoryMap: Record<string, number> = {};
    for (const enq of this.data.enquiries) {
      categoryMap[enq.category] = (categoryMap[enq.category] || 0) + 1;
    }

    // Top FAQs
    const topFAQs = [...this.data.faqs]
      .sort((a, b) => b.timesAsked - a.timesAsked)
      .slice(0, 5)
      .map(f => ({ id: f.id, question: f.question, timesAsked: f.timesAsked, category: f.category }));

    return {
      totalEnquiries,
      todayEnquiries,
      pendingEnquiries,
      resolvedEnquiries,
      totalCourses,
      totalDocs,
      totalChunks,
      totalFAQs,
      enquiriesByCategory: categoryMap,
      topFAQs,
      totalChatInteractions: this.data.chatLogs.length,
    };
  }
}

export const db = new Database();
