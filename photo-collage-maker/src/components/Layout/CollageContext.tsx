import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CollageImage, CollageGrid, CollageOptions, GridCell, ImageFit } from '../../types';

// Default collage options
const defaultOptions: CollageOptions = {
  backgroundColor: '#ffffff',
  cellSpacing: 2,
  imageFit: 'cover',
};

// Context interface
interface CollageContextType {
  images: CollageImage[];
  grid: CollageGrid | null;
  options: CollageOptions;
  selectedImageId: string | null;
  selectedCellId: string | null;
  addImages: (files: File[]) => Promise<void>;
  removeImage: (id: string) => void;
  updateGrid: (grid: CollageGrid) => void;
  generateGrid: () => void;
  shuffleImages: () => void;
  setSelectedImageId: (id: string | null) => void;
  setSelectedCellId: (id: string | null) => void;
  updateOptions: (newOptions: Partial<CollageOptions>) => void;
  assignImageToCell: (imageId: string, cellId: string) => void;
}

// Create the context
const CollageContext = createContext<CollageContextType | undefined>(undefined);

// Provider component
export const CollageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<CollageImage[]>([]);
  const [grid, setGrid] = useState<CollageGrid | null>(null);
  const [options, setOptions] = useState<CollageOptions>(defaultOptions);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);

  // Add images to the collage
  const addImages = async (files: File[]) => {
    const newImages: CollageImage[] = [];

    for (const file of files) {
      // Create URL for the image
      const url = URL.createObjectURL(file);
      
      // Get image dimensions
      const dimensions = await getImageDimensions(url);
      
      newImages.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        url,
        width: dimensions.width,
        height: dimensions.height,
        aspectRatio: dimensions.width / dimensions.height,
      });
    }

    setImages([...images, ...newImages]);
  };

  // Get image dimensions
  const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };
      img.src = url;
    });
  };

  // Remove an image from the collage
  const removeImage = (id: string) => {
    // Remove the image URL from memory
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    // Remove image from state
    setImages(images.filter(img => img.id !== id));

    // Update grid if needed
    if (grid) {
      const updatedCells = grid.cells.map(cell => {
        if (cell.imageId === id) {
          return { ...cell, imageId: undefined };
        }
        return cell;
      });
      setGrid({ ...grid, cells: updatedCells });
    }
  };

  // Update grid
  const updateGrid = (newGrid: CollageGrid) => {
    setGrid(newGrid);
  };

  // Generate grid based on images
  const generateGrid = () => {
    if (images.length === 0) return;

    // Calculate optimal grid layout
    const total = images.length;
    const aspectRatio = 16 / 9; // Default aspect ratio
    
    let cols = Math.ceil(Math.sqrt(total * aspectRatio));
    let rows = Math.ceil(total / cols);
    
    // Ensure we have at least the minimum number of cells
    while (rows * cols < total) {
      cols++;
    }
    
    // Create cells
    const canvasWidth = 1200;
    const canvasHeight = canvasWidth / aspectRatio;
    const cellWidth = canvasWidth / cols;
    const cellHeight = canvasHeight / rows;
    
    const cells: GridCell[] = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col;
        if (index < total) {
          cells.push({
            id: `cell-${index}`,
            x: col * cellWidth,
            y: row * cellHeight,
            width: cellWidth,
            height: cellHeight,
            imageId: images[index].id,
          });
        }
      }
    }
    
    setGrid({
      rows,
      columns: cols,
      width: canvasWidth,
      height: canvasHeight,
      cells,
    });
  };

  // Shuffle images in the grid
  const shuffleImages = () => {
    if (!grid || images.length === 0) return;
    
    // Get all images that are in the grid
    const imageIds = images.map(img => img.id);
    
    // Shuffle the image IDs
    const shuffledIds = [...imageIds].sort(() => Math.random() - 0.5);
    
    // Assign shuffled images to cells
    const updatedCells = grid.cells.map((cell, index) => {
      if (index < shuffledIds.length) {
        return { ...cell, imageId: shuffledIds[index] };
      }
      return cell;
    });
    
    setGrid({ ...grid, cells: updatedCells });
  };

  // Update collage options
  const updateOptions = (newOptions: Partial<CollageOptions>) => {
    setOptions({ ...options, ...newOptions });
  };

  // Assign an image to a cell
  const assignImageToCell = (imageId: string, cellId: string) => {
    if (!grid) return;
    
    const updatedCells = grid.cells.map(cell => {
      // If the cell is the target, assign the image
      if (cell.id === cellId) {
        return { ...cell, imageId };
      }
      // If the image is already in another cell, remove it
      if (cell.imageId === imageId) {
        return { ...cell, imageId: undefined };
      }
      return cell;
    });
    
    setGrid({ ...grid, cells: updatedCells });
  };

  // Clean up image URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(image => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, []);

  const value = {
    images,
    grid,
    options,
    selectedImageId,
    selectedCellId,
    addImages,
    removeImage,
    updateGrid,
    generateGrid,
    shuffleImages,
    setSelectedImageId,
    setSelectedCellId,
    updateOptions,
    assignImageToCell,
  };

  return <CollageContext.Provider value={value}>{children}</CollageContext.Provider>;
};

// Custom hook to use the collage context
export const useCollage = () => {
  const context = useContext(CollageContext);
  if (context === undefined) {
    throw new Error('useCollage must be used within a CollageProvider');
  }
  return context;
};