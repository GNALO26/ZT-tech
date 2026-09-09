import { useState } from 'react';

export default function ImageWithFallback({ src, fallback = '/images/placeholder.jpg', alt, ...props }) {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallback)}
      loading="lazy"
      {...props}
    />
  );
}