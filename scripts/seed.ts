import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.bblbdodziysbvlisupzx:jeyamportfoliodb@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
});

const profile = {
  name: 'Dhananjeyan M',
  tagline: 'Electronics and Communication Engineering graduate & aspiring software developer',
  bio: 'Electronics and Communication Engineering graduate and aspiring software developer with hands-on experience in full-stack web and Android app development. Skilled in building responsive applications and collaborating effectively in teams. Eager to contribute and grow in impactful projects.',
  resume_url: 'Resume_.pdf',
  social_links: {
    linkedin: 'linkedin.com/in/dhananjeyan-m',
    github: 'github.com/dhananjeyan',
    portfolio: 'portfolio-link.com'
  }
};

const projects = [
  {
    title: 'Heart Disease Prediction Using Hybrid ML',
    description: 'Integrated multimodal data (clinical, ECG, X-ray, echocardiogram). Developed Hybrid ML/DL models for improved diagnosis accuracy.',
    tech_stack: ['Python', 'ML/DL'],
    repo_url: '',
    live_url: '',
    image_url: 'project1.jpg',
    featured: true
  },
  {
    title: 'E-Commerce Eflyer',
    description: 'Full-stack e-commerce application with authentication and product management. Implemented a shopping cart, responsive UI, and backend integration via Express.js.',
    tech_stack: ['HTML', 'CSS', 'JS', 'Node.js', 'Express'],
    repo_url: '',
    live_url: '',
    image_url: 'project2.jpg',
    featured: true
  },
  {
    title: 'Furniture Website',
    description: 'Responsive furniture e-commerce interface with filters, interactive order forms and improved UI/UX.',
    tech_stack: ['HTML', 'CSS', 'JS'],
    repo_url: '',
    live_url: '',
    image_url: 'project3.jpg',
    featured: true
  },
  {
    title: 'E-Book Management System',
    description: 'Full CRUD book management with authentication. Handled sessions and deployed on Apache Tomcat.',
    tech_stack: ['Java', 'JSP', 'MySQL', 'Tomcat'],
    repo_url: '',
    live_url: '',
    image_url: 'project4.jpg',
    featured: false
  },
  {
    title: 'School Management System',
    description: 'Comprehensive system featuring user management, attendance tracking, marks, assignments, fees, and notices. Built with Spring Boot backend, MySQL database, and responsive frontend.',
    tech_stack: ['HTML', 'CSS', 'JS', 'Java', 'Spring Boot', 'MySQL'],
    repo_url: '',
    live_url: '',
    image_url: 'project5.jpg',
    featured: true
  }
];

const experience = [
  {
    company: 'SetNext, Erode',
    role: 'AI/ML Engineer Intern',
    start_date: 'Dec 2025',
    end_date: 'Feb 2026',
    description: 'Developed and trained machine learning models for prediction and data analysis. Assisted in data preprocessing, model evaluation, and AI feature integration.',
    highlights: ['Model Training', 'Data Preprocessing', 'AI feature integration']
  },
  {
    company: 'Accent Techno Soft, Coimbatore',
    role: 'Full Stack Web Development Intern',
    start_date: 'Jul 2024',
    end_date: 'Aug 2024',
    description: 'Developed mini full-stack apps using React.js, Node.js, MongoDB. Gained experience in API integration, deployment, and version control.',
    highlights: ['React.js', 'Node.js', 'API Integration']
  },
  {
    company: 'Phoenix Soft Tech, Madurai',
    role: 'Android App Development Intern',
    start_date: 'Jun 2023',
    end_date: 'Jul 2023',
    description: 'Built Android apps with Java, improving UI/UX. Integrated SQLite and Google Maps API for data storage and location services.',
    highlights: ['Android Java', 'SQLite', 'Google Maps API']
  }
];

const skills = [
  { name: 'HTML', category: 'Languages', proficiency: 90 },
  { name: 'CSS', category: 'Languages', proficiency: 90 },
  { name: 'JavaScript', category: 'Languages', proficiency: 85 },
  { name: 'Java', category: 'Languages', proficiency: 80 },
  { name: 'React.js', category: 'Frameworks', proficiency: 85 },
  { name: 'Spring Boot', category: 'Frameworks', proficiency: 75 },
  { name: 'Node.js', category: 'Frameworks', proficiency: 80 },
  { name: 'Express', category: 'Frameworks', proficiency: 80 },
  { name: 'MySQL', category: 'Databases', proficiency: 85 },
  { name: 'MongoDB', category: 'Databases', proficiency: 80 },
  { name: 'Python', category: 'Languages', proficiency: 75 }
];

async function seed() {
  await client.connect();
  console.log('Connected to DB');

  try {
    // Clear existing
    await client.query('TRUNCATE profile, projects, experience, skills, content_embeddings, chat_logs RESTART IDENTITY CASCADE;');

    // Insert Profile
    await client.query(
      'INSERT INTO profile (name, tagline, bio, resume_url, social_links) VALUES ($1, $2, $3, $4, $5)',
      [profile.name, profile.tagline, profile.bio, profile.resume_url, JSON.stringify(profile.social_links)]
    );

    // Insert Projects
    for (const p of projects) {
      await client.query(
        'INSERT INTO projects (title, description, tech_stack, repo_url, live_url, image_url, featured) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [p.title, p.description, p.tech_stack, p.repo_url, p.live_url, p.image_url, p.featured]
      );
    }

    // Insert Experience
    for (const e of experience) {
      await client.query(
        'INSERT INTO experience (company, role, start_date, end_date, description, highlights) VALUES ($1, $2, $3, $4, $5, $6)',
        [e.company, e.role, e.start_date, e.end_date, e.description, e.highlights]
      );
    }

    // Insert Skills
    for (const s of skills) {
      await client.query(
        'INSERT INTO skills (name, category, proficiency) VALUES ($1, $2, $3)',
        [s.name, s.category, s.proficiency]
      );
    }

    console.log('Seeding completed successfully.');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await client.end();
  }
}

seed();
