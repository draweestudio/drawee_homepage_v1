import React from 'react';

export const isVideo = (url?: string) => {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return lowerUrl.includes('.mp4') || lowerUrl.includes('.webm') || lowerUrl.includes('.mov');
};

export const isEmbed = (url?: string) => {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return lowerUrl.includes('vimeo.com') || lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be');
};

export const getEmbedUrl = (url: string) => {
  if (url.includes('vimeo.com')) {
    const match = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (match) return `https://player.vimeo.com/video/${match[1]}?background=1&autoplay=1&loop=1&byline=0&title=0`;
  }
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&controls=0&playlist=${match[1]}`;
  }
  return url;
};

interface MediaDisplayProps {
  url: string;
  className?: string;
  alt?: string;
  pointerEventsNone?: boolean;
}

export default function MediaDisplay({ url, className = '', alt = 'Media', pointerEventsNone = false }: MediaDisplayProps) {
  const combinedClassName = `${className} ${pointerEventsNone ? 'pointer-events-none' : ''}`.trim();

  if (isEmbed(url)) {
    return (
      <iframe
        src={getEmbedUrl(url)}
        className={combinedClassName}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        style={{ border: 'none' }}
      />
    );
  }
  
  if (isVideo(url)) {
    return (
      <video
        src={url}
        autoPlay
        loop
        muted
        playsInline
        className={combinedClassName}
      />
    );
  }
  
  return (
    <img
      src={url}
      alt={alt}
      className={combinedClassName}
      referrerPolicy="no-referrer"
    />
  );
}
