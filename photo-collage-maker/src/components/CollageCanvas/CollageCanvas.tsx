'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { useCollage } from '../Layout/CollageContext';
import { GridCell } from '../../types';

interface CollageCanvasProps {
  onExport?: (dataUrl: string) => void;
}

const CollageCanvas: React.FC<CollageCanvasProps> = ({ onExport }) => {
  const { grid, images, options, selectedCellId, setSelectedCellId } = useCollage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());

  // Load images when grid changes
  useEffect(() => {
    if (!grid) return;

    const imageMap = new Map<string, HTMLImageElement>();
    const imagesToLoad = images.filter(img => 
      grid.cells.some(cell => cell.imageId === img.id)
    );

    if (imagesToLoad.length === 0) {
      drawCanvas(imageMap);
      return;
    }

    let loadedCount = 0;
    
    imagesToLoad.forEach(imgData => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageMap.set(imgData.id, img);
        loadedCount++;
        
        if (loadedCount === imagesToLoad.length) {
          setLoadedImages(imageMap);
          drawCanvas(imageMap);
        }
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${imgData.url}`);
        loadedCount++;
        
        if (loadedCount === imagesToLoad.length) {
          setLoadedImages(imageMap);
          drawCanvas(imageMap);
        }
      };
      img.src = imgData.url;
    });
  }, [grid, images, options]);

  // Redraw canvas when loaded images, options or selected cell changes
  useEffect(() => {
    drawCanvas(loadedImages);
  }, [loadedImages, options, selectedCellId]);

  // Handle canvas click for cell selection
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!grid || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    // Find which cell was clicked
    const clickedCell = grid.cells.find(cell => {
      const cellX = cell.x + options.cellSpacing / 2;
      const cellY = cell.y + options.cellSpacing / 2;
      const cellWidth = cell.width - options.cellSpacing;
      const cellHeight = cell.height - options.cellSpacing;
      
      return (
        x >= cellX && 
        x <= cellX + cellWidth && 
        y >= cellY && 
        y <= cellY + cellHeight
      );
    });

    if (clickedCell) {
      setSelectedCellId(clickedCell.id);
    }
  };

  // Draw the collage on canvas
  const drawCanvas = (imageMap: Map<string, HTMLImageElement>) => {
    if (!grid || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = grid.width;
    canvas.height = grid.height;

    // Clear canvas and fill with background color
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each cell
    grid.cells.forEach(cell => {
      const x = cell.x + options.cellSpacing / 2;
      const y = cell.y + options.cellSpacing / 2;
      const width = cell.width - options.cellSpacing;
      const height = cell.height - options.cellSpacing;

      // Draw cell background
      ctx.fillStyle = '#e0e0e0';
      ctx.fillRect(x, y, width, height);

      // Draw image if available
      if (cell.imageId) {
        const img = imageMap.get(cell.imageId);
        if (img) {
          drawImageInCell(ctx, img, cell, options.imageFit);
        }
      }

      // Draw selection border if cell is selected
      if (cell.id === selectedCellId) {
        ctx.strokeStyle = '#1976D2';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
      }
    });
  };

  // Helper function to draw an image in a cell with proper fit
  const drawImageInCell = (
    ctx: CanvasRenderingContext2D, 
    img: HTMLImageElement, 
    cell: GridCell, 
    imageFit: 'fill' | 'contain' | 'cover' | 'none'
  ) => {
    const spacing = options.cellSpacing;
    const cellX = cell.x + spacing / 2;
    const cellY = cell.y + spacing / 2;
    const cellWidth = cell.width - spacing;
    const cellHeight = cell.height - spacing;
    
    const imageWidth = img.width;
    const imageHeight = img.height;
    const imageRatio = imageWidth / imageHeight;
    const cellRatio = cellWidth / cellHeight;
    
    let width = cellWidth;
    let height = cellHeight;
    let x = cellX;
    let y = cellY;
    
    if (imageFit === 'contain') {
      if (imageRatio > cellRatio) {
        // Image is wider than cell
        width = cellWidth;
        height = width / imageRatio;
        y = cellY + (cellHeight - height) / 2;
      } else {
        // Image is taller than cell
        height = cellHeight;
        width = height * imageRatio;
        x = cellX + (cellWidth - width) / 2;
      }
    } else if (imageFit === 'cover') {
      if (imageRatio > cellRatio) {
        // Image is wider than cell
        height = cellHeight;
        width = height * imageRatio;
        x = cellX + (cellWidth - width) / 2;
      } else {
        // Image is taller than cell
        width = cellWidth;
        height = width / imageRatio;
        y = cellY + (cellHeight - height) / 2;
      }
    }
    
    ctx.drawImage(img, x, y, width, height);
  };

  // Handle export button click
  const handleExportClick = () => {
    if (!canvasRef.current || !onExport) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onExport(dataUrl);
  };

  if (!grid) {
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          minHeight: 400,
          backgroundColor: '#f8f8f8'
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Upload images and create a collage to see the preview here
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, width: '100%', height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Collage Preview
      </Typography>
      
      <Box sx={{ 
        width: '100%',
        maxWidth: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 1,
        padding: 2
      }}>
        <Box 
          ref={containerRef}
          className="canvas-container" 
          sx={{ maxWidth: '100%', marginBottom: 2 }}
        >
          <canvas 
            ref={canvasRef} 
            onClick={handleCanvasClick}
            style={{ 
              maxWidth: '100%', 
              height: 'auto',
              display: 'block'
            }}
          />
        </Box>
        
        {onExport && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleExportClick}
          >
            Export Collage
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default CollageCanvas;