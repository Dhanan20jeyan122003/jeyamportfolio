import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dhananjeyan M | AI-Powered Portfolio',
    short_name: 'Dhananjeyan Portfolio',
    description: 'Portfolio of Dhananjeyan M, Software Developer and AI Engineer specializing in Java, React, Spring Boot, and Generative AI.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdfbf7',
    theme_color: '#ff4d6d',
    icons: [
      {
        src: '/profile.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/profile.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
