// app/components/Metatags.tsx
'use client';

import { useEffect } from 'react';

interface MetatagsProps {
  title?: string;
  description?: string;
  image?: string;
}

const Metatags: React.FC<MetatagsProps> = ({
  title = 'The Full Next.js + Firebase Course',
  description = 'A complete Next.js + Firebase course by Fireship.io',
  image = 'https://fireship.io/courses/react-next-firebase/img/featured.png',
}) => {
  useEffect(() => {
    // Update Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', image);

    // Update Twitter tags
    updateMetaTag('twitter:card', 'summary');
    updateMetaTag('twitter:site', '@fireship_dev');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
  }, [title, description, image]);

  return null;
};

// Helper function to update meta tags
function updateMetaTag(name: string, content: string) {
  let meta = document.querySelector(`meta[property="${name}"]`) || 
             document.querySelector(`meta[name="${name}"]`);
             
  if (!meta) {
    meta = document.createElement('meta');
    if (name.startsWith('og:')) {
      meta.setAttribute('property', name);
    } else {
      meta.setAttribute('name', name);
    }
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

export default Metatags;