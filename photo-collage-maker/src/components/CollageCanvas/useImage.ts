import { useState, useEffect } from 'react';

/**
 * Custom hook to load and cache images for Konva
 */
const useImage = (url: string): HTMLImageElement | null => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!url) return;

    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    
    const onLoad = () => {
      setImage(img);
    };

    const onError = () => {
      console.error(`Failed to load image: ${url}`);
      setImage(null);
    };

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
    
    img.src = url;

    return () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
  }, [url]);

  return image;
};

export default useImage;