import React from 'react';
import { getSiteUrl } from '@/lib/siteUrl';

export default function StructuredData() {
  const baseUrl = getSiteUrl();

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseUrl}/#person`,
    name: 'Dhananjeyan M',
    alternateName: [
      'Dhananjeyan',
      'Dhanan jeyan',
      'Dhanan20jeyan122003',
      'Jeyam',
      'Dhananjeyan M Portfolio',
    ],
    givenName: 'Dhananjeyan',
    familyName: 'M',
    gender: 'Male',
    jobTitle: 'Junior Software Engineer & AI Engineer',
    description:
      'Motivated Electronics and Communication Engineering graduate with expertise in Java, React.js, Spring Boot, and Generative AI (LLMs, Ollama, RAG). Junior Software Engineer at WBC Software Lab.',
    url: baseUrl,
    image: `${baseUrl}/profile.png`,
    email: 'mailto:kmayan1967@gmail.com',
    sameAs: [
      'https://github.com/Dhanan20jeyan122003',
      'https://www.linkedin.com/in/dhananjeyan-m-837139217/',
      'https://github.com/Dhanan20jeyan122003/jeyamportfolio',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'WBC Software Lab',
      location: 'Karaikkudi, India',
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Electronics and Communication Engineering',
    },
    knowsAbout: [
      'Generative AI',
      'Large Language Models (LLMs)',
      'Retrieval-Augmented Generation (RAG)',
      'Ollama',
      'Agentic AI',
      'Model Context Protocol (MCP)',
      'Java',
      'Spring Boot',
      'React.js',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Python',
      'FastAPI',
      'Full-Stack Web Development',
      'Machine Learning',
      'PostgreSQL',
      'Supabase',
      'MySQL',
      'MongoDB',
    ],
    nationality: {
      '@type': 'Country',
      name: 'India',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'India',
    },
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Dhananjeyan M | AI-Powered Portfolio',
    alternateName: [
      'Dhananjeyan Portfolio',
      'Jeyam Portfolio',
      'Studio Orb AI Portfolio',
      'Dhananjeyan M Official Website',
    ],
    author: {
      '@id': `${baseUrl}/#person`,
    },
    description:
      'Official interactive portfolio of Dhananjeyan M featuring Studio Orb RAG AI assistant, full-stack projects, and engineering experience.',
    inLanguage: 'en-US',
  };

  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${baseUrl}/#webpage`,
    url: baseUrl,
    name: 'Dhananjeyan M — AI-Powered Portfolio & Resume',
    isPartOf: {
      '@id': `${baseUrl}/#website`,
    },
    about: {
      '@id': `${baseUrl}/#person`,
    },
    mainEntity: {
      '@id': `${baseUrl}/#person`,
    },
    description:
      'Explore projects, skills, and experience of Dhananjeyan M, including Heart Disease ML, E-Commerce, School Management System, and generative AI apps.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
    </>
  );
}
