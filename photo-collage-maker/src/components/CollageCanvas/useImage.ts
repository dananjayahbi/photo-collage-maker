import { useState, useEffect } from 'react';
import { CollageImage, CollageGrid } from '../../types';

export interface LoadedImage extends CollageImage {
  element: HTMLImageElement | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * A custom hook to load images for the collage
 * @param images Array of CollageImage objects
 * @param grid Current grid configuration
 * @returns Array of loaded images with HTML elements
 */
export const useImage = (images: CollageImage[], grid: CollageGrid | null): LoadedImage[] => {
  const [loadedImages, setLoadedImages] = useState<LoadedImage[]>([]);

  useEffect(() => {
    if (!images.length) {
      setLoadedImages([]);
      return;
    }

    // Initialize the array with loading state
    const initialLoadingState: LoadedImage[] = images.map(img => ({
      ...img,
      element: null,
      isLoading: true,
      error: null
    }));
    
    setLoadedImages(initialLoadingState);
    
    // Load each image
    const imagePromises = images.map((image, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        
        img.onload = () => {
          setLoadedImages(prev => {
            const newState = [...prev];
            newState[index] = {
              ...newState[index],
              element: img,
              isLoading: false
            };
            return newState;
          });
          resolve();
        };
        
        img.onerror = () => {
          setLoadedImages(prev => {
            const newState = [...prev];
            newState[index] = {
              ...newState[index],
              isLoading: false,
              error: 'Failed to load image'
            };
            return newState;
          });
          resolve();
        };
        
        img.src = image.url;
      });
    });
    
    Promise.all(imagePromises).catch((error) => {
      console.error('Error loading images:', error);
    });
    
    return () => {
      // Clean up
      loadedImages.forEach(img => {
        if (img.element) {
          // Remove references to help with garbage collection
          img.element.onload = null;
          img.element.onerror = null;
        }
      });
    };
  }, [images]);

  return loadedImages;
};

export default useImage;