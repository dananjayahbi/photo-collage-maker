import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UploadedImage, GridType, CollageOptions, Cell, CellStyle, GridTemplate } from '../../types';

interface CollageContextType {
  images: UploadedImage[];
  addImage: (file: File, dataUrl: string) => void;
  removeImage: (id: string) => void;
  grid: GridType | null;
  setGrid: (grid: GridType | null) => void;
  generateGrid: (template: GridTemplate) => void;
  assignImageToCell: (cellId: string, imageId: string | undefined) => void;
  getImageById: (id: string | undefined) => UploadedImage | undefined;
  updateCellStyle: (cellId: string, style: Partial<CellStyle>) => void;
  options: CollageOptions;
  updateOptions: (newOptions: Partial<CollageOptions>) => void;
  shuffleImages: () => void;
  generateOptimizedGrid: () => void;
  selectedCellId: string | null;
  setSelectedCellId: (id: string | null) => void;
}

const defaultOptions: CollageOptions = {
  cellGap: 4,
  cellSpacing: 0,
  cellBorderRadius: 0,
  backgroundColor: '#ffffff',
  cellBorderWidth: 0,
  cellBorderColor: '#000000',
  padding: 16,
};

const defaultCellStyle: CellStyle = {
  objectFit: 'cover',
  position: { x: 0, y: 0 },
  zoom: 1,
};

const CollageContext = createContext<CollageContextType | undefined>(undefined);

export const CollageProvider = ({ children }: { children: ReactNode }) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [grid, setGrid] = useState<GridType | null>(null);
  const [options, setOptions] = useState<CollageOptions>(defaultOptions);
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);

  const addImage = (file: File, dataUrl: string) => {
    const newImage: UploadedImage = {
      id: uuidv4(),
      file,
      dataUrl,
    };

    // Load the image to get its dimensions
    const img = new Image();
    img.onload = () => {
      setImages((prevImages) => prevImages.map((image) => {
        if (image.id === newImage.id) {
          return {
            ...image,
            width: img.width,
            height: img.height,
            aspectRatio: img.width / img.height,
          };
        }
        return image;
      }));
    };
    img.src = dataUrl;

    setImages((prevImages) => [...prevImages, newImage]);
  };

  const removeImage = (id: string) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
    
    // Also remove the image from any cell that was using it
    if (grid) {
      const updatedCells = grid.cells.map(cell => {
        if (cell.imageId === id) {
          return { ...cell, imageId: undefined };
        }
        return cell;
      });
      
      setGrid({
        ...grid,
        cells: updatedCells,
      });
    }
  };

  const getImageById = (id: string | undefined) => {
    if (!id) return undefined;
    return images.find((image) => image.id === id);
  };

  // Create a grid from a template
  const generateGrid = (template: GridTemplate) => {
    if (!template) return;
    
    const cells: Cell[] = [];
    let newGrid: GridType;
    
    // Generate cells based on the template type
    switch (template.type) {
      case 'standard': {
        const rows = template.rows || 2;
        const columns = template.columns || 2;
        
        for (let row = 1; row <= rows; row++) {
          for (let col = 1; col <= columns; col++) {
            cells.push({
              id: uuidv4(),
              rowStart: row,
              rowEnd: row + 1,
              columnStart: col,
              columnEnd: col + 1,
              style: { ...defaultCellStyle },
            });
          }
        }
        
        newGrid = {
          type: 'standard',
          rows,
          columns,
          cells,
        };
        break;
      }
      
      case 'horizontal': {
        const columns = template.columns || 3;
        const rows = 1;
        
        for (let col = 1; col <= columns; col++) {
          cells.push({
            id: uuidv4(),
            rowStart: 1,
            rowEnd: 2,
            columnStart: col,
            columnEnd: col + 1,
            style: { ...defaultCellStyle },
          });
        }
        
        newGrid = {
          type: 'horizontal',
          rows,
          columns,
          cells,
        };
        break;
      }
      
      case 'vertical': {
        const rows = template.rows || 3;
        const columns = 1;
        
        for (let row = 1; row <= rows; row++) {
          cells.push({
            id: uuidv4(),
            rowStart: row,
            rowEnd: row + 1,
            columnStart: 1,
            columnEnd: 2,
            style: { ...defaultCellStyle },
          });
        }
        
        newGrid = {
          type: 'vertical',
          rows,
          columns,
          cells,
        };
        break;
      }
      
      case 'masonry': {
        const columns = template.columns || 3;
        const cellCount = Math.max(columns * 2, images.length || 0); // At least 2 rows worth of cells
        
        for (let i = 0; i < cellCount; i++) {
          cells.push({
            id: uuidv4(),
            columnStart: (i % columns) + 1,
            columnEnd: (i % columns) + 2,
            style: { ...defaultCellStyle },
          });
        }
        
        newGrid = {
          type: 'masonry',
          columns,
          cells,
        };
        break;
      }
      
      case 'mosaic': {
        // Create a 3x3 asymmetric grid
        const gridAreas = `
          "large large small-1"
          "large large small-2"
          "small-3 small-4 small-5"
        `;
        
        const areas = ['large', 'small-1', 'small-2', 'small-3', 'small-4', 'small-5'];
        
        areas.forEach(area => {
          cells.push({
            id: uuidv4(),
            gridArea: area,
            style: { ...defaultCellStyle },
          });
        });
        
        newGrid = {
          type: 'mosaic',
          gridTemplateAreas: gridAreas.trim(),
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr 1fr',
          cells,
        };
        break;
      }
      
      case 'featured': {
        // One large image with column of smaller images
        const gridAreas = `
          "feature secondary-1"
          "feature secondary-2"
          "feature secondary-3"
        `;
        
        const areas = ['feature', 'secondary-1', 'secondary-2', 'secondary-3'];
        
        areas.forEach(area => {
          cells.push({
            id: uuidv4(),
            gridArea: area,
            style: { ...defaultCellStyle },
          });
        });
        
        newGrid = {
          type: 'featured',
          gridTemplateAreas: gridAreas.trim(),
          gridTemplateColumns: '2fr 1fr',
          gridTemplateRows: 'repeat(3, 1fr)',
          cells,
        };
        break;
      }
      
      case 'split': {
        // Split view based on orientation
        const isHorizontal = template.orientation === 'horizontal';
        
        const gridAreas = isHorizontal ? 
          `"top top"
           "bottom-left bottom-right"` :
          `"left top-right"
           "left bottom-right"`;
        
        const areas = isHorizontal ? 
          ['top', 'bottom-left', 'bottom-right'] : 
          ['left', 'top-right', 'bottom-right'];
        
        areas.forEach(area => {
          cells.push({
            id: uuidv4(),
            gridArea: area,
            style: { ...defaultCellStyle },
          });
        });
        
        newGrid = {
          type: 'split',
          orientation: template.orientation,
          gridTemplateAreas: gridAreas.trim(),
          gridTemplateColumns: isHorizontal ? '1fr 1fr' : '1fr 1fr',
          gridTemplateRows: isHorizontal ? '1fr 1fr' : '1fr 1fr',
          cells,
        };
        break;
      }
      
      // You could add more custom template types here
      
      default: {
        // Default to a 2x2 grid
        const rows = 2;
        const columns = 2;
        
        for (let row = 1; row <= rows; row++) {
          for (let col = 1; col <= columns; col++) {
            cells.push({
              id: uuidv4(),
              rowStart: row,
              rowEnd: row + 1,
              columnStart: col,
              columnEnd: col + 1,
              style: { ...defaultCellStyle },
            });
          }
        }
        
        newGrid = {
          type: 'standard',
          rows,
          columns,
          cells,
        };
      }
    }
    
    // Set the grid once at the end
    setGrid(newGrid);
    
    // Clear selected cell
    setSelectedCellId(null);
  };

  const assignImageToCell = (cellId: string, imageId: string | undefined) => {
    if (!grid) return;

    const updatedCells = grid.cells.map((cell) => {
      if (cell.id === cellId) {
        return { ...cell, imageId };
      }
      return cell;
    });

    setGrid({
      ...grid,
      cells: updatedCells,
    });
  };

  const updateCellStyle = (cellId: string, styleUpdate: Partial<CellStyle>) => {
    if (!grid) return;

    const updatedCells = grid.cells.map((cell) => {
      if (cell.id === cellId) {
        return { 
          ...cell, 
          style: { 
            ...cell.style, 
            ...styleUpdate 
          } 
        };
      }
      return cell;
    });

    setGrid({
      ...grid,
      cells: updatedCells,
    });
  };

  const updateOptions = (newOptions: Partial<CollageOptions>) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      ...newOptions,
    }));
  };

  const shuffleImages = () => {
    if (!grid || images.length === 0) return;
    
    // Get a random selection of images
    const shuffledImages = [...images].sort(() => Math.random() - 0.5);
    
    // Assign them to cells
    const updatedCells = grid.cells.map((cell, index) => {
      return {
        ...cell,
        imageId: index < shuffledImages.length ? shuffledImages[index].id : undefined
      };
    });
    
    setGrid({
      ...grid,
      cells: updatedCells
    });
  };

  const generateOptimizedGrid = () => {
    if (images.length === 0) return;
    
    // Determine grid layout based on number of images
    const numImages = images.length;
    let template: GridTemplate;
    
    if (numImages === 1) {
      template = { name: '1 × 1', type: 'standard', rows: 1, columns: 1, orientation: 'square' };
    } else if (numImages === 2) {
      // For 2 images, check if they're both landscape or both portrait
      const landscapeCount = images.filter(img => (img.width || 1) > (img.height || 1)).length;
      
      if (landscapeCount === 2) {
        template = { name: '2 × 1', type: 'vertical', rows: 2, columns: 1, orientation: 'portrait' };
      } else if (landscapeCount === 0) {
        template = { name: '1 × 2', type: 'horizontal', rows: 1, columns: 2, orientation: 'landscape' };
      } else {
        template = { name: '2 × 1', type: 'vertical', rows: 2, columns: 1, orientation: 'portrait' };
      }
    } else if (numImages === 3) {
      template = { name: 'Split', type: 'split', orientation: 'horizontal' };
    } else if (numImages === 4) {
      template = { name: '2 × 2', type: 'standard', rows: 2, columns: 2, orientation: 'square' };
    } else if (numImages <= 6) {
      template = { name: '2 × 3', type: 'standard', rows: 2, columns: 3, orientation: 'landscape' };
    } else if (numImages <= 9) {
      template = { name: '3 × 3', type: 'standard', rows: 3, columns: 3, orientation: 'square' };
    } else if (numImages <= 12) {
      template = { name: '3 × 4', type: 'standard', rows: 3, columns: 4, orientation: 'landscape' };
    } else {
      template = { name: 'Masonry', type: 'masonry', columns: 4, orientation: 'mixed' };
    }
    
    // Generate the grid
    generateGrid(template);
    
    // Assign images to cells after a short delay to ensure grid is created
    setTimeout(() => {
      if (!grid) return;
      
      const updatedCells = grid.cells.map((cell, index) => {
        return {
          ...cell,
          imageId: index < images.length ? images[index].id : undefined
        };
      });
      
      setGrid(prevGrid => {
        if (!prevGrid) return null;
        return {
          ...prevGrid,
          cells: updatedCells
        };
      });
    }, 100);
  };

  useEffect(() => {
    // Clean up any cells that reference deleted images
    if (grid) {
      const imageIds = images.map((img) => img.id);
      const updatedCells = grid.cells.map((cell) => {
        if (cell.imageId && !imageIds.includes(cell.imageId)) {
          return { ...cell, imageId: undefined };
        }
        return cell;
      });

      setGrid({
        ...grid,
        cells: updatedCells,
      });
    }
  }, [images, grid]);

  return (
    <CollageContext.Provider
      value={{
        images,
        addImage,
        removeImage,
        grid,
        setGrid,
        generateGrid,
        assignImageToCell,
        getImageById,
        updateCellStyle,
        options,
        updateOptions,
        shuffleImages,
        generateOptimizedGrid,
        selectedCellId,
        setSelectedCellId,
      }}
    >
      {children}
    </CollageContext.Provider>
  );
};

export const useCollage = (): CollageContextType => {
  const context = useContext(CollageContext);
  if (context === undefined) {
    throw new Error('useCollage must be used within a CollageProvider');
  }
  return context;
};