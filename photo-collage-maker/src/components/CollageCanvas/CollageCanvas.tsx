'use client';

import React, { useRef, useEffect, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  CircularProgress, 
  IconButton, 
  Tooltip,
  Menu,
  MenuItem,
  Slider,
  Card,
  CardContent,
  Popover,
  ButtonGroup,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Fab
} from '@mui/material';
import html2canvas from 'html2canvas';
import { useCollage } from '../Layout/CollageContext';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import CropFreeIcon from '@mui/icons-material/CropFree';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface CollageCanvasProps {
  exportRef: React.MutableRefObject<(() => Promise<string | null>) | null>;
}

interface CellControlsState {
  zoom: number;
  positionX: number;
  positionY: number;
  fit: 'cover' | 'contain' | 'fill';
}

const initialCellControlState: CellControlsState = {
  zoom: 100,
  positionX: 50,
  positionY: 50,
  fit: 'cover',
};

const CollageCanvas: React.FC<CollageCanvasProps> = ({ exportRef }) => {
  const { grid, images, options, assignImageToCell } = useCollage();
  const [canvasZoom, setCanvasZoom] = useState(100);
  const [loading, setLoading] = useState(false);
  const [cellControls, setCellControls] = useState<Record<string, CellControlsState>>({});
  const [cellControlsAnchorEl, setCellControlsAnchorEl] = useState<HTMLElement | null>(null);
  const [activeCellId, setActiveCellId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Theme for controls overlay
  const controlsTheme = createTheme({
    palette: {
      primary: { main: '#ffffff' },
      secondary: { main: '#2196f3' },
      background: { paper: 'rgba(0, 0, 0, 0.7)' }
    },
  });

  // Set up the export reference for the parent component
  useEffect(() => {
    if (exportRef) {
      exportRef.current = async () => {
        if (!canvasRef.current || !grid) return null;
        
        // Create a temporary container for export that will be properly rendered
        const exportContainer = document.createElement('div');
        exportContainer.style.position = 'absolute';
        exportContainer.style.left = '-9999px';
        exportContainer.style.top = '-9999px';
        exportContainer.style.width = '1000px'; // Fixed width for consistent output
        exportContainer.style.backgroundColor = options.backgroundColor || '#ffffff';
        exportContainer.style.padding = '16px';
        exportContainer.style.boxSizing = 'border-box';
        document.body.appendChild(exportContainer);
        
        // Create grid container with the same styles but without transform scale
        const gridContainer = document.createElement('div');
        gridContainer.style.display = 'grid';
        gridContainer.style.gap = `${options.cellGap || 4}px`;
        gridContainer.style.width = '100%';
        gridContainer.style.position = 'relative';
        
        // Get the row height multiplier from options
        const rowHeight = options.rowHeight || 1;
        
        // Set specific grid properties based on type (no scaling)
        switch (grid.type) {
          case 'standard':
            gridContainer.style.gridTemplateColumns = `repeat(${grid.columns}, 1fr)`;
            gridContainer.style.gridTemplateRows = `repeat(${grid.rows}, ${rowHeight}fr)`;
            gridContainer.style.aspectRatio = `${grid.columns} / ${grid.rows * rowHeight}`;
            break;
          
          case 'masonry':
            gridContainer.style.gridTemplateColumns = `repeat(${grid.columns}, 1fr)`;
            gridContainer.style.gridAutoRows = `${10 * rowHeight}px`;
            break;
          
          case 'mosaic':
          case 'featured':
          case 'split':
            gridContainer.style.gridTemplateAreas = grid.gridTemplateAreas;
            gridContainer.style.gridTemplateColumns = grid.gridTemplateColumns;
            if (grid.gridTemplateRows) {
              // Apply rowHeight to existing template rows
              gridContainer.style.gridTemplateRows = grid.gridTemplateRows.replace(
                /1fr/g, 
                `${rowHeight}fr`
              );
            } else {
              gridContainer.style.gridTemplateRows = `repeat(3, ${rowHeight}fr)`;
            }
            gridContainer.style.aspectRatio = `16 / ${9 * rowHeight}`;
            break;
          
          case 'horizontal':
            gridContainer.style.gridTemplateColumns = `repeat(${grid.columns}, 1fr)`;
            gridContainer.style.gridTemplateRows = `${rowHeight}fr`;
            gridContainer.style.aspectRatio = `${grid.columns} / ${rowHeight}`;
            break;
          
          case 'vertical':
            gridContainer.style.gridTemplateColumns = '1fr';
            gridContainer.style.gridTemplateRows = `repeat(${grid.rows}, ${rowHeight}fr)`;
            gridContainer.style.aspectRatio = `1 / ${grid.rows * rowHeight}`;
            break;
            
          case 'custom':
            // Handle custom layouts with gridTemplateAreas
            if (grid.gridTemplateAreas) {
              gridContainer.style.gridTemplateAreas = grid.gridTemplateAreas;
              gridContainer.style.gridTemplateColumns = grid.gridTemplateColumns || 'repeat(3, 1fr)';
              if (grid.gridTemplateRows) {
                // Apply rowHeight to existing template rows
                gridContainer.style.gridTemplateRows = grid.gridTemplateRows.replace(
                  /1fr/g, 
                  `${rowHeight}fr`
                );
              } else {
                gridContainer.style.gridTemplateRows = `repeat(3, ${rowHeight}fr)`;
              }
              // Adjust aspect ratio for different variants
              if (grid.variant === 'timeline') {
                gridContainer.style.aspectRatio = `5 / ${rowHeight}`;
              } else {
                gridContainer.style.aspectRatio = `16 / ${9 * rowHeight}`;
              }
            }
            // For custom layouts that use standard grid
            else if (grid.rows && grid.columns) {
              gridContainer.style.gridTemplateColumns = `repeat(${grid.columns}, 1fr)`;
              gridContainer.style.gridTemplateRows = `repeat(${grid.rows}, ${rowHeight}fr)`;
              gridContainer.style.aspectRatio = `${grid.columns} / ${grid.rows * rowHeight}`;
            }
            // For gallery-like layouts that need auto rows
            else if (grid.variant === 'gallery') {
              gridContainer.style.gridTemplateColumns = grid.gridTemplateColumns || 'repeat(4, 1fr)';
              if (grid.gridAutoRows) {
                gridContainer.style.gridAutoRows = grid.gridAutoRows.replace(
                  /\d+px/, 
                  (match) => `${parseInt(match) * rowHeight}px`
                );
              } else {
                gridContainer.style.gridAutoRows = `${100 * rowHeight}px`;
              }
            }
            break;
        }
        
        exportContainer.appendChild(gridContainer);
        
        // Create each cell with its image
        grid.cells.forEach((cell, index) => {
          const cellImage = cell.imageId ? images.find(img => img.id === cell.imageId) : null;
          const cellControl = cellControls[cell.id] || initialCellControlState;
          
          // Create cell container
          const cellDiv = document.createElement('div');
          cellDiv.style.padding = `${options.cellSpacing || 4}px`;
          cellDiv.style.backgroundColor = options.backgroundColor || '#fff';
          cellDiv.style.overflow = 'hidden';
          cellDiv.style.position = 'relative';
          cellDiv.style.borderRadius = '4px';
          
          // Apply grid positioning
          if (cell.gridArea) cellDiv.style.gridArea = cell.gridArea;
          if (cell.gridColumn) cellDiv.style.gridColumn = cell.gridColumn;
          if (cell.gridRow) cellDiv.style.gridRow = cell.gridRow;
          
          // For masonry layout
          if (grid.type === 'masonry') {
            const cellImage = cell.imageId ? images.find(img => img.id === cell.imageId) : null;
            const aspectRatio = cellImage?.aspectRatio || 1;
            const rowSpan = Math.ceil((1 / aspectRatio) * 30);
            
            cellDiv.style.gridColumn = `${(index % grid.columns) + 1}`;
            cellDiv.style.gridRow = `span ${rowSpan}`;
          }
          
          // Create inner content container
          const innerDiv = document.createElement('div');
          innerDiv.style.width = '100%';
          innerDiv.style.height = '100%';
          innerDiv.style.position = 'relative';
          innerDiv.style.overflow = 'hidden';
          innerDiv.style.borderRadius = '2px';
          innerDiv.style.backgroundColor = cellImage ? 'transparent' : 'rgba(0,0,0,0.05)';
          innerDiv.style.display = 'flex';
          innerDiv.style.alignItems = 'center';
          innerDiv.style.justifyContent = 'center';
          innerDiv.style.minHeight = '80px';
          
          // Add image if exists
          if (cellImage) {
            const img = document.createElement('img');
            img.src = cellImage.dataUrl;
            img.alt = `Image ${index}`;
            
            // Apply image styling from cell controls
            img.style.width = `${cellControl.zoom}%`;
            img.style.height = `${cellControl.zoom}%`;
            img.style.objectFit = cellControl.fit;
            img.style.objectPosition = `${cellControl.positionX}% ${cellControl.positionY}%`;
            img.style.position = 'absolute';
            img.style.top = '50%';
            img.style.left = '50%';
            img.style.transform = 'translate(-50%, -50%)';
            img.style.borderRadius = '2px';
            img.style.display = 'block';
            
            innerDiv.appendChild(img);
          }
          
          cellDiv.appendChild(innerDiv);
          gridContainer.appendChild(cellDiv);
        });
        
        try {
          // Use html2canvas with specific options for better rendering
          const canvas = await html2canvas(gridContainer, {
            backgroundColor: options.backgroundColor || '#ffffff',
            logging: false,
            useCORS: true,
            allowTaint: true,
            scale: 2, // Higher quality output
            imageTimeout: 0,
            removeContainer: false
          });
          
          const dataUrl = canvas.toDataURL('image/png');
          
          // Clean up the temporary elements
          document.body.removeChild(exportContainer);
          
          return dataUrl;
        } catch (error) {
          console.error("Error exporting collage:", error);
          
          // Clean up even on error
          if (document.body.contains(exportContainer)) {
            document.body.removeChild(exportContainer);
          }
          
          return null;
        }
      };
    }
  }, [exportRef, grid, images, options, cellControls]);

  // Initialize cell controls as cells are created
  useEffect(() => {
    if (grid && grid.cells) {
      const existingCellIds = Object.keys(cellControls);
      const newCellIds = grid.cells.map(cell => cell.id);
      
      // Check if we actually need to update the controls
      const needsUpdate = 
        newCellIds.length !== existingCellIds.length || 
        newCellIds.some(id => !existingCellIds.includes(id));
      
      if (needsUpdate) {
        const newCellControls: Record<string, CellControlsState> = {};
        
        grid.cells.forEach(cell => {
          // Preserve existing controls if they exist
          newCellControls[cell.id] = cellControls[cell.id] || {...initialCellControlState};
        });
        
        setCellControls(newCellControls);
      }
    }
  }, [grid?.cells.map(cell => cell.id).join(',')]);

  // Increase canvas zoom level
  const zoomIn = () => {
    setCanvasZoom(prev => Math.min(prev + 10, 150));
  };

  // Decrease canvas zoom level
  const zoomOut = () => {
    setCanvasZoom(prev => Math.max(prev - 10, 50));
  };

  // Handle opening cell controls
  const handleOpenCellControls = (e: React.MouseEvent, cellId: string) => {
    e.stopPropagation();
    setCellControlsAnchorEl(e.currentTarget as HTMLElement);
    setActiveCellId(cellId);
  };

  // Handle closing cell controls
  const handleCloseCellControls = () => {
    setCellControlsAnchorEl(null);
    setActiveCellId(null);
  };

  // Handle cell zoom change
  const handleCellZoomChange = (value: number) => {
    if (!activeCellId) return;
    
    setCellControls(prev => ({
      ...prev,
      [activeCellId]: {
        ...prev[activeCellId],
        zoom: value
      }
    }));
  };

  // Handle cell position change
  const handleCellPositionChange = (axis: 'x' | 'y', value: number) => {
    if (!activeCellId) return;
    
    setCellControls(prev => ({
      ...prev,
      [activeCellId]: {
        ...prev[activeCellId],
        ...(axis === 'x' ? { positionX: value } : { positionY: value })
      }
    }));
  };

  // Handle cell fit change
  const handleCellFitChange = (fit: 'cover' | 'contain' | 'fill') => {
    if (!activeCellId) return;
    
    setCellControls(prev => ({
      ...prev,
      [activeCellId]: {
        ...prev[activeCellId],
        fit
      }
    }));
  };

  // Handle drag over for cells
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // Handle drop for cells (to receive images from the ImageUploader)
  const handleDrop = (e: React.DragEvent, cellId: string) => {
    e.preventDefault();
    
    // Try multiple ways to get the image ID 
    let imageId = e.dataTransfer.getData('imageId');
    
    if (!imageId) {
      // Try plain text format
      imageId = e.dataTransfer.getData('text/plain');
    }
    
    if (!imageId) {
      // Try JSON format
      try {
        const jsonData = e.dataTransfer.getData('application/json');
        if (jsonData) {
          const data = JSON.parse(jsonData);
          imageId = data.imageId;
        }
      } catch (err) {
        console.error("Error parsing JSON data from drag event:", err);
      }
    }
    
    if (imageId) {
      assignImageToCell(cellId, imageId);
    }
  };

  // Handle removing image from cell
  const handleRemoveImageFromCell = (cellId: string) => {
    assignImageToCell(cellId, undefined);
    handleCloseCellControls();
  };

  // Get style for a specific cell
  const getCellStyle = (cell: any) => {
    return {
      gridArea: cell.gridArea || undefined,
      gridColumn: cell.gridColumn || undefined,
      gridRow: cell.gridRow || undefined,
      backgroundColor: options.backgroundColor || '#fff',
      overflow: 'hidden',
      position: 'relative',
      borderRadius: '4px',
      cursor: 'pointer',
      padding: `${options.cellSpacing || 4}px`,
      transition: 'all 0.2s',
      '&:hover': {
        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.5)'
      }
    };
  };

  // Get style for an image inside a cell
  const getImageStyle = (cell: any) => {
    const cellControl = cellControls[cell.id] || initialCellControlState;
    const imageFit = cellControl.fit;
    const zoom = cellControl.zoom / 100;
    const positionX = cellControl.positionX;
    const positionY = cellControl.positionY;
    
    return {
      width: `${100 * zoom}%`,
      height: `${100 * zoom}%`,
      objectFit: imageFit,
      objectPosition: `${positionX}% ${positionY}%`,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '2px',
      display: 'block',
    } as React.CSSProperties;
  };

  // Get grid container style based on grid type
  const getGridContainerStyle = () => {
    if (!grid) return {};
    
    // Base styles for all grids
    const baseStyle: React.CSSProperties = {
      display: 'grid',
      gap: `${options.cellGap || 4}px`,
      width: '100%',
      transform: `scale(${canvasZoom / 100})`,
      transformOrigin: 'top left',
      height: grid.type === 'standard' ? 'auto' : undefined, // Only auto height for standard grids
    };

    // Different grid styles based on type
    switch (grid.type) {
      case 'standard':
        return {
          ...baseStyle,
          gridTemplateColumns: `repeat(${grid.columns}, 1fr)`,
          // Apply rowHeight multiplier to the grid template rows
          gridTemplateRows: `repeat(${grid.rows}, ${options.rowHeight}fr)`,
          // Adjust aspect ratio using the rowHeight 
          aspectRatio: grid.columns / (grid.rows * options.rowHeight),
        };
      
      case 'masonry':
        // Masonry layout with CSS Grid
        return {
          ...baseStyle,
          gridTemplateColumns: `repeat(${grid.columns}, 1fr)`,
          gridAutoRows: `${10 * options.rowHeight}px`, // Adjust auto row height with rowHeight
        };
      
      case 'mosaic':
        // Mosaic uses grid template areas
        return {
          ...baseStyle,
          gridTemplateAreas: grid.gridTemplateAreas,
          gridTemplateColumns: grid.gridTemplateColumns,
          // Apply rowHeight to the template rows if present
          gridTemplateRows: grid.gridTemplateRows?.replace(/1fr/g, `${options.rowHeight}fr`) || 
                           `repeat(3, ${options.rowHeight}fr)`,
          aspectRatio: 16 / (9 * options.rowHeight),
        };
      
      case 'featured':
        // Featured uses grid template areas
        return {
          ...baseStyle,
          gridTemplateAreas: grid.gridTemplateAreas,
          gridTemplateColumns: grid.gridTemplateColumns,
          // Apply rowHeight to the template rows if present
          gridTemplateRows: grid.gridTemplateRows?.replace(/1fr/g, `${options.rowHeight}fr`) || 
                           `repeat(3, ${options.rowHeight}fr)`,
          aspectRatio: 16 / (9 * options.rowHeight),
        };
      
      case 'horizontal':
        return {
          ...baseStyle,
          gridTemplateColumns: `repeat(${grid.columns}, 1fr)`,
          gridTemplateRows: `${options.rowHeight}fr`, // Apply rowHeight
          aspectRatio: grid.columns / options.rowHeight,
        };
      
      case 'vertical':
        return {
          ...baseStyle,
          gridTemplateColumns: '1fr',
          // Apply rowHeight to each row
          gridTemplateRows: `repeat(${grid.rows}, ${options.rowHeight}fr)`,
          aspectRatio: 1 / (grid.rows * options.rowHeight),
        };
      
      case 'split':
        return {
          ...baseStyle,
          gridTemplateAreas: grid.gridTemplateAreas,
          gridTemplateColumns: grid.gridTemplateColumns,
          // Apply rowHeight to the template rows if present
          gridTemplateRows: grid.gridTemplateRows?.replace(/1fr/g, `${options.rowHeight}fr`) || 
                           `repeat(2, ${options.rowHeight}fr)`,
          aspectRatio: 16 / (9 * options.rowHeight),
        };
      
      case 'custom':
        // Handle custom layouts - they use grid template areas in most cases
        if (grid.gridTemplateAreas) {
          return {
            ...baseStyle,
            gridTemplateAreas: grid.gridTemplateAreas,
            gridTemplateColumns: grid.gridTemplateColumns || 'repeat(3, 1fr)',
            // Apply rowHeight to the template rows if present
            gridTemplateRows: grid.gridTemplateRows?.replace(/1fr/g, `${options.rowHeight}fr`) || 
                             `repeat(3, ${options.rowHeight}fr)`,
            aspectRatio: grid.variant === 'timeline' ? 5 / options.rowHeight : 16 / (9 * options.rowHeight),
          };
        }
        
        // For custom layouts that use standard grid (like stacked)
        if (grid.rows && grid.columns) {
          return {
            ...baseStyle,
            gridTemplateColumns: `repeat(${grid.columns}, 1fr)`,
            // Apply rowHeight to each row
            gridTemplateRows: `repeat(${grid.rows}, ${options.rowHeight}fr)`,
            aspectRatio: grid.columns / (grid.rows * options.rowHeight),
          };
        }
        
        // For gallery-like layouts that need auto rows
        if (grid.variant === 'gallery') {
          return {
            ...baseStyle,
            gridTemplateColumns: grid.gridTemplateColumns || 'repeat(4, 1fr)',
            gridAutoRows: grid.gridAutoRows ? 
              grid.gridAutoRows.replace(/\d+px/, (match) => `${parseInt(match) * options.rowHeight}px`) : 
              `${100 * options.rowHeight}px`,
          };
        }
      
      default:
        return baseStyle;
    }
  };

  // Compute masonry layout styles for specific cells
  const getMasonryItemStyle = (cell: any, index: number) => {
    if (grid?.type !== 'masonry') return {};
    
    const cellImage = cell.imageId ? images.find(img => img.id === cell.imageId) : null;
    const aspectRatio = cellImage?.aspectRatio || 1;
    
    // Calculate how many grid rows this item should span based on its aspect ratio
    const rowSpan = Math.ceil((1 / aspectRatio) * 30); // Scale factor for grid rows
    
    return {
      gridColumn: `${(index % grid.columns) + 1}`,
      gridRow: `span ${rowSpan}`,
    };
  };

  // Render cell controls popover
  const renderCellControls = () => {
    if (!activeCellId) return null;
    
    const cellControl = cellControls[activeCellId] || initialCellControlState;
    const open = Boolean(cellControlsAnchorEl);
    
    return (
      <ThemeProvider theme={controlsTheme}>
        <Popover
          open={open}
          anchorEl={cellControlsAnchorEl}
          onClose={handleCloseCellControls}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: 2,
                maxWidth: 320,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                color: 'white',
              },
            },
          }}
        >
          <Box sx={{ p: 2, width: 300 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" color="white">Cell Settings</Typography>
              <IconButton size="small" onClick={handleCloseCellControls} sx={{ color: 'white' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <Typography variant="body2" color="white" gutterBottom>Fit</Typography>
            <ButtonGroup variant="outlined" fullWidth sx={{ mb: 2 }}>
              <Button 
                onClick={() => handleCellFitChange('cover')}
                variant={cellControl.fit === 'cover' ? 'contained' : 'outlined'}
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Cover
              </Button>
              <Button 
                onClick={() => handleCellFitChange('contain')}
                variant={cellControl.fit === 'contain' ? 'contained' : 'outlined'}
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Contain
              </Button>
              <Button 
                onClick={() => handleCellFitChange('fill')}
                variant={cellControl.fit === 'fill' ? 'contained' : 'outlined'}
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Fill
              </Button>
            </ButtonGroup>
            
            <Typography variant="body2" color="white" gutterBottom>Zoom</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton size="small" onClick={() => handleCellZoomChange(Math.max(cellControl.zoom - 10, 100))}>
                <ZoomOutIcon fontSize="small" sx={{ color: 'white' }} />
              </IconButton>
              <Slider
                value={cellControl.zoom}
                min={100}
                max={300}
                step={10}
                onChange={(e, value) => handleCellZoomChange(value as number)}
                sx={{ mx: 1 }}
              />
              <IconButton size="small" onClick={() => handleCellZoomChange(Math.min(cellControl.zoom + 10, 300))}>
                <ZoomInIcon fontSize="small" sx={{ color: 'white' }} />
              </IconButton>
              <Typography variant="body2" sx={{ ml: 1, minWidth: 40 }} color="white">
                {cellControl.zoom}%
              </Typography>
            </Box>
            
            <Typography variant="body2" color="white" gutterBottom>Position X</Typography>
            <Slider
              value={cellControl.positionX}
              min={0}
              max={100}
              onChange={(e, value) => handleCellPositionChange('x', value as number)}
              sx={{ mb: 2 }}
            />
            
            <Typography variant="body2" color="white" gutterBottom>Position Y</Typography>
            <Slider
              value={cellControl.positionY}
              min={0}
              max={100}
              onChange={(e, value) => handleCellPositionChange('y', value as number)}
              sx={{ mb: 2 }}
            />
            
            <Button 
              variant="contained" 
              color="error" 
              onClick={() => handleRemoveImageFromCell(activeCellId)}
              fullWidth
              sx={{ mt: 1 }}
            >
              Remove Image
            </Button>
          </Box>
        </Popover>
      </ThemeProvider>
    );
  };

  // Render loading state if no grid is available
  if (!grid) {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: 400,
          backgroundColor: options.backgroundColor || '#ffffff',
          borderRadius: 2
        }}
      >
        <Typography variant="h6" color="text.secondary" align="center">
          Select a layout template to create your collage
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          width: '100%',
          backgroundColor: options.backgroundColor,
          borderRadius: 2,
          overflow: 'hidden',
          p: 2
        }}
      >
        {/* Zoom controls */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8, 
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: '16px',
            display: 'flex',
            zIndex: 5,
          }}
        >
          <IconButton size="small" onClick={zoomOut} disabled={canvasZoom <= 50}>
            <ZoomOutIcon />
          </IconButton>
          <Typography variant="body2" sx={{ lineHeight: '30px', px: 1 }}>
            {canvasZoom}%
          </Typography>
          <IconButton size="small" onClick={zoomIn} disabled={canvasZoom >= 150}>
            <ZoomInIcon />
          </IconButton>
        </Box>
        
        {/* The grid container */}
        <Box 
          ref={canvasRef}
          sx={{ 
            ...getGridContainerStyle(),
            transition: 'transform 0.2s ease',
            minHeight: '400px',
          }}
        >
          {grid.cells.map((cell, index) => {
            const cellImage = cell.imageId ? images.find(img => img.id === cell.imageId) : null;
            
            return (
              <Box
                key={cell.id}
                sx={{
                  ...getCellStyle(cell),
                  ...(grid.type === 'masonry' ? getMasonryItemStyle(cell, index) : {})
                }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, cell.id)}
              >
                {/* Cell content */}
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '2px',
                    backgroundColor: cellImage ? 'transparent' : 'rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '80px'
                  }}
                >
                  {/* Image */}
                  {cellImage && (
                    <img 
                      src={cellImage.dataUrl} 
                      alt={`Image ${index}`} 
                      style={getImageStyle(cell)} 
                      onLoad={() => setLoading(false)}
                      onError={() => setLoading(false)}
                    />
                  )}
                  
                  {/* Cell overlay - only visible when hovered */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      '&:hover': {
                        opacity: 1,
                      }
                    }}
                  >
                    {/* Cell settings button */}
                    {cellImage ? (
                      <Tooltip title="Cell Settings">
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleOpenCellControls(e, cell.id)}
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 1)',
                            },
                          }}
                        >
                          <SettingsIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Typography variant="caption" color="white">
                        Drop image here
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
        
        {/* Cell controls popover */}
        {renderCellControls()}
        
        {/* Loading overlay */}
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 2,
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Paper>
      
      <Box
        sx={{
          mt: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Drag images from the sidebar to the grid cells
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${grid.cells.length} cells in layout`}
        </Typography>
      </Box>
    </Box>
  );
};

export default CollageCanvas;