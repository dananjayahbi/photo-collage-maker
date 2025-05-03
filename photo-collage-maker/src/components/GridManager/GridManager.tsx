'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Grid, 
  Paper, 
  useTheme, 
  Tabs, 
  Tab, 
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Divider,
  Badge,
  Chip,
  Slider
} from '@mui/material';
import { useCollage } from '../Layout/CollageContext';
import { GridTemplate } from '../../types';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import GridOnIcon from '@mui/icons-material/GridOn';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface GridLayoutPreviewProps {
  template: GridTemplate;
  selected: boolean;
  onClick: () => void;
}

const GridLayoutPreview: React.FC<GridLayoutPreviewProps> = ({ template, selected, onClick }) => {
  const theme = useTheme();
  
  const renderPreview = () => {
    const cells = [];
    const gap = '2px';
    
    switch (template.type) {
      case 'standard':
        const rows = template.rows || 2;
        const cols = template.columns || 2;
        
        for (let i = 0; i < rows * cols; i++) {
          cells.push(
            <Box 
              key={i}
              sx={{ 
                backgroundColor: selected ? 'primary.main' : 'primary.light',
                borderRadius: '2px',
                transition: 'all 0.2s',
              }}
            />
          );
        }

        return (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap,
              width: '100%',
              height: '70px',
              cursor: 'pointer',
              '&:hover': {
                '& > div': {
                  backgroundColor: 'primary.main',
                  opacity: 0.9
                }
              }
            }}
            onClick={onClick}
          >
            {cells}
          </Box>
        );

      case 'masonry':
        // Columns of different heights
        const columns = template.columns || 3;
        return (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap,
              width: '100%',
              height: '70px',
              cursor: 'pointer',
              '&:hover': {
                '& > div': {
                  backgroundColor: 'primary.main',
                  opacity: 0.9
                }
              }
            }}
            onClick={onClick}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Box 
                key={colIndex} 
                sx={{ 
                  display: 'grid',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  gap,
                  height: '100%'
                }}
              >
                {Array.from({ length: 3 }).map((_, rowIndex) => (
                  <Box 
                    key={rowIndex} 
                    sx={{ 
                      backgroundColor: selected ? 'primary.main' : 'primary.light',
                      height: rowIndex === 1 ? '150%' : '100%',
                      borderRadius: '2px',
                      transition: 'all 0.2s',
                    }} 
                  />
                ))}
              </Box>
            ))}
          </Box>
        );

      case 'mosaic':
        // Asymmetric grid
        return (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateAreas: `
                "large large small-1"
                "large large small-2"
                "small-3 small-4 small-5"
              `,
              gridTemplateColumns: '1fr 1fr 1fr',
              gridTemplateRows: '1fr 1fr 1fr',
              gap,
              width: '100%',
              height: '70px',
              cursor: 'pointer',
              '&:hover': {
                '& > div': {
                  backgroundColor: 'primary.main',
                  opacity: 0.9
                }
              }
            }}
            onClick={onClick}
          >
            <Box sx={{ 
              gridArea: 'large', 
              backgroundColor: selected ? 'primary.main' : 'primary.light',
              borderRadius: '2px',
              transition: 'all 0.2s'
            }} />
            <Box sx={{ 
              gridArea: 'small-1', 
              backgroundColor: selected ? 'primary.main' : 'primary.light',
              borderRadius: '2px',
              transition: 'all 0.2s'
            }} />
            <Box sx={{ 
              gridArea: 'small-2', 
              backgroundColor: selected ? 'primary.main' : 'primary.light',
              borderRadius: '2px',
              transition: 'all 0.2s'
            }} />
            <Box sx={{ 
              gridArea: 'small-3', 
              backgroundColor: selected ? 'primary.main' : 'primary.light',
              borderRadius: '2px',
              transition: 'all 0.2s'
            }} />
            <Box sx={{ 
              gridArea: 'small-4', 
              backgroundColor: selected ? 'primary.main' : 'primary.light',
              borderRadius: '2px',
              transition: 'all 0.2s'
            }} />
            <Box sx={{ 
              gridArea: 'small-5', 
              backgroundColor: selected ? 'primary.main' : 'primary.light',
              borderRadius: '2px',
              transition: 'all 0.2s'
            }} />
          </Box>
        );

      case 'featured':
        // One large image with column of smaller images
        return (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateAreas: `
                "feature secondary-1"
                "feature secondary-2"
                "feature secondary-3"
              `,
              gridTemplateColumns: '2fr 1fr',
              gridTemplateRows: 'repeat(3, 1fr)',
              gap,
              width: '100%',
              height: '70px',
              cursor: 'pointer',
              '&:hover': {
                '& > div': {
                  backgroundColor: 'primary.main',
                  opacity: 0.9
                }
              }
            }}
            onClick={onClick}
          >
            <Box sx={{ 
              gridArea: 'feature', 
              backgroundColor: selected ? 'primary.main' : 'primary.light',
              borderRadius: '2px',
              transition: 'all 0.2s'
            }} />
            <Box sx={{ 
              gridArea: 'secondary-1', 
              backgroundColor: selected ? 'primary.main' : 'primary.light',
              borderRadius: '2px',
              transition: 'all 0.2s'
            }} />
            <Box sx={{ 
              gridArea: 'secondary-2', 
              backgroundColor: selected ? 'primary.main' : 'primary.light',
              borderRadius: '2px',
              transition: 'all 0.2s'
            }} />
            <Box sx={{ 
              gridArea: 'secondary-3', 
              backgroundColor: selected ? 'primary.main' : 'primary.light',
              borderRadius: '2px',
              transition: 'all 0.2s'
            }} />
          </Box>
        );

      // New layout types
      case 'horizontal':
        return (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateRows: `repeat(1, 1fr)`,
              gridTemplateColumns: `repeat(${template.columns}, 1fr)`,
              gap,
              width: '100%',
              height: '70px',
              cursor: 'pointer',
              '&:hover': {
                '& > div': {
                  backgroundColor: 'primary.main',
                  opacity: 0.9
                }
              }
            }}
            onClick={onClick}
          >
            {Array.from({ length: template.columns || 3 }).map((_, i) => (
              <Box 
                key={i}
                sx={{ 
                  backgroundColor: selected ? 'primary.main' : 'primary.light',
                  borderRadius: '2px',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </Box>
        );

      case 'vertical':
        return (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateRows: `repeat(${template.rows}, 1fr)`,
              gridTemplateColumns: `repeat(1, 1fr)`,
              gap,
              width: '100%',
              height: '70px',
              cursor: 'pointer',
              '&:hover': {
                '& > div': {
                  backgroundColor: 'primary.main',
                  opacity: 0.9
                }
              }
            }}
            onClick={onClick}
          >
            {Array.from({ length: template.rows || 3 }).map((_, i) => (
              <Box 
                key={i}
                sx={{ 
                  backgroundColor: selected ? 'primary.main' : 'primary.light',
                  borderRadius: '2px',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </Box>
        );

      case 'split':
        // Split view layout
        return (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateAreas: template.orientation === 'horizontal' ? 
                `"top top" "bottom-left bottom-right"` :
                `"left top-right" "left bottom-right"`,
              gridTemplateColumns: template.orientation === 'horizontal' ? '1fr 1fr' : '1fr 1fr',
              gridTemplateRows: template.orientation === 'horizontal' ? '1fr 1fr' : '1fr 1fr',
              gap,
              width: '100%',
              height: '70px',
              cursor: 'pointer',
              '&:hover': {
                '& > div': {
                  backgroundColor: 'primary.main',
                  opacity: 0.9
                }
              }
            }}
            onClick={onClick}
          >
            <Box sx={{ 
              gridArea: template.orientation === 'horizontal' ? 'top' : 'left', 
              backgroundColor: selected ? 'primary.main' : 'primary.light',
              borderRadius: '2px',
              transition: 'all 0.2s'
            }} />
            <Box sx={{ 
              gridArea: template.orientation === 'horizontal' ? 'bottom-left' : 'top-right', 
              backgroundColor: selected ? 'primary.main' : 'primary.light',
              borderRadius: '2px',
              transition: 'all 0.2s'
            }} />
            <Box sx={{ 
              gridArea: template.orientation === 'horizontal' ? 'bottom-right' : 'bottom-right', 
              backgroundColor: selected ? 'primary.main' : 'primary.light',
              borderRadius: '2px',
              transition: 'all 0.2s'
            }} />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={selected ? 3 : 1}
      sx={{ 
        p: 1,
        borderRadius: 1,
        transition: 'all 0.2s',
        border: selected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
        height: '100%',
      }}
    >
      <Typography variant="caption" align="center" display="block" sx={{ mb: 1, fontWeight: selected ? 'bold' : 'normal' }}>
        {template.name}
      </Typography>
      {renderPreview()}
    </Paper>
  );
};

// Modified onExport prop type
interface GridManagerProps {
  onExport: () => void;
}

const GridManager: React.FC<GridManagerProps> = ({ onExport }) => {
  const { generateGrid, shuffleImages, generateOptimizedGrid, images, grid, options, updateOptions } = useCollage();
  const [tabValue, setTabValue] = useState(0);
  const [standardPage, setStandardPage] = useState(1);
  const [specialPage, setSpecialPage] = useState(1);
  const [selectedOrientation, setSelectedOrientation] = useState<string>('all');
  
  const ITEMS_PER_PAGE = 8;
  
  // Define grid templates - much more now as requested
  const standardTemplates = [
    { name: '1 × 1', type: 'standard', rows: 1, columns: 1, orientation: 'square' },
    { name: '1 × 2', type: 'horizontal', rows: 1, columns: 2, orientation: 'landscape' },
    { name: '2 × 1', type: 'vertical', rows: 2, columns: 1, orientation: 'portrait' },
    { name: '2 × 2', type: 'standard', rows: 2, columns: 2, orientation: 'square' },
    { name: '3 × 1', type: 'vertical', rows: 3, columns: 1, orientation: 'portrait' },
    { name: '1 × 3', type: 'horizontal', rows: 1, columns: 3, orientation: 'landscape' },
    { name: '2 × 3', type: 'standard', rows: 2, columns: 3, orientation: 'landscape' },
    { name: '3 × 2', type: 'standard', rows: 3, columns: 2, orientation: 'portrait' },
    { name: '3 × 3', type: 'standard', rows: 3, columns: 3, orientation: 'square' },
    { name: '4 × 1', type: 'vertical', rows: 4, columns: 1, orientation: 'portrait' },
    { name: '1 × 4', type: 'horizontal', rows: 1, columns: 4, orientation: 'landscape' },
    { name: '4 × 2', type: 'standard', rows: 4, columns: 2, orientation: 'portrait' },
    { name: '2 × 4', type: 'standard', rows: 2, columns: 4, orientation: 'landscape' },
    { name: '4 × 3', type: 'standard', rows: 4, columns: 3, orientation: 'portrait' },
    { name: '3 × 4', type: 'standard', rows: 3, columns: 4, orientation: 'landscape' },
    { name: '4 × 4', type: 'standard', rows: 4, columns: 4, orientation: 'square' },
    { name: '5 × 1', type: 'vertical', rows: 5, columns: 1, orientation: 'portrait' },
    { name: '1 × 5', type: 'horizontal', rows: 1, columns: 5, orientation: 'landscape' },
    { name: '5 × 2', type: 'standard', rows: 5, columns: 2, orientation: 'portrait' },
    { name: '2 × 5', type: 'standard', rows: 2, columns: 5, orientation: 'landscape' },
    { name: '5 × 3', type: 'standard', rows: 5, columns: 3, orientation: 'portrait' },
    { name: '3 × 5', type: 'standard', rows: 3, columns: 5, orientation: 'landscape' },
    { name: '5 × 4', type: 'standard', rows: 5, columns: 4, orientation: 'portrait' },
    { name: '4 × 5', type: 'standard', rows: 4, columns: 5, orientation: 'landscape' },
    { name: '6 × 3', type: 'standard', rows: 6, columns: 3, orientation: 'portrait' },
    { name: '3 × 6', type: 'standard', rows: 3, columns: 6, orientation: 'landscape' },
    { name: '7 × 3', type: 'standard', rows: 7, columns: 3, orientation: 'portrait' },
    { name: '3 × 7', type: 'standard', rows: 3, columns: 7, orientation: 'landscape' },
  ];
  
  const specialTemplates = [
    { name: 'Masonry (3 cols)', type: 'masonry', columns: 3, orientation: 'mixed' },
    { name: 'Masonry (4 cols)', type: 'masonry', columns: 4, orientation: 'mixed' },
    { name: 'Masonry (5 cols)', type: 'masonry', columns: 5, orientation: 'mixed' },
    { name: 'Classic Mosaic', type: 'mosaic', orientation: 'mixed' },
    { name: 'Featured + Grid', type: 'featured', orientation: 'mixed' },
    { name: 'H-Split Top', type: 'split', orientation: 'horizontal', variant: 'top' },
    { name: 'H-Split Bottom', type: 'split', orientation: 'horizontal', variant: 'bottom' },
    { name: 'V-Split Left', type: 'split', orientation: 'vertical', variant: 'left' },
    { name: 'V-Split Right', type: 'split', orientation: 'vertical', variant: 'right' },
    { name: 'Horizontal Banner', type: 'horizontal', rows: 1, columns: 6, orientation: 'landscape' },
    { name: 'Vertical Banner', type: 'vertical', rows: 6, columns: 1, orientation: 'portrait' },
    // Add more special layouts here
    { name: '2+3 Split', type: 'custom', variant: '2+3', orientation: 'mixed' },
    { name: '3+2 Split', type: 'custom', variant: '3+2', orientation: 'mixed' },
    { name: 'T-Shape', type: 'custom', variant: 'T-shape', orientation: 'landscape' },
    { name: 'L-Shape', type: 'custom', variant: 'L-shape', orientation: 'mixed' },
    { name: 'Cross Shape', type: 'custom', variant: 'cross', orientation: 'square' },
    { name: 'Diagonal', type: 'custom', variant: 'diagonal', orientation: 'mixed' },
    { name: 'Stacked', type: 'custom', variant: 'stacked', orientation: 'mixed' },
    { name: 'Pyramid', type: 'custom', variant: 'pyramid', orientation: 'landscape' },
    { name: 'Inverted Pyramid', type: 'custom', variant: 'inverted-pyramid', orientation: 'landscape' },
    { name: 'Pentagon', type: 'custom', variant: 'pentagon', orientation: 'mixed' },
    { name: 'Circle Gallery', type: 'custom', variant: 'circle', orientation: 'square' },
    { name: 'Polaroid Stack', type: 'custom', variant: 'polaroid', orientation: 'mixed' },
    { name: 'Gallery Wall', type: 'custom', variant: 'gallery', orientation: 'mixed' },
    { name: 'Timeline', type: 'custom', variant: 'timeline', orientation: 'mixed' },
    { name: 'Spiral', type: 'custom', variant: 'spiral', orientation: 'square' },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filter templates by orientation
  const filteredStandard = selectedOrientation === 'all' 
    ? standardTemplates 
    : standardTemplates.filter(t => t.orientation === selectedOrientation);

  const filteredSpecial = selectedOrientation === 'all' 
    ? specialTemplates 
    : specialTemplates.filter(t => t.orientation === selectedOrientation);

  // Paginate templates
  const paginatedStandard = filteredStandard.slice(
    (standardPage - 1) * ITEMS_PER_PAGE, 
    standardPage * ITEMS_PER_PAGE
  );

  const paginatedSpecial = filteredSpecial.slice(
    (specialPage - 1) * ITEMS_PER_PAGE, 
    specialPage * ITEMS_PER_PAGE
  );

  // Calculate total pages
  const standardPages = Math.ceil(filteredStandard.length / ITEMS_PER_PAGE);
  const specialPages = Math.ceil(filteredSpecial.length / ITEMS_PER_PAGE);

  // Check if a template is the current active one
  const isActive = (template: GridTemplate) => {
    if (!grid) return false;
    
    if (template.type === 'standard' && grid.type === 'standard' && 
        grid.columns === template.columns && grid.rows === template.rows) {
      return true;
    }
    
    // For other templates, check the type and specific properties
    return grid.type === template.type && (
      template.type !== 'masonry' || 
      (template.type === 'masonry' && 'columns' in grid && grid.columns === template.columns)
    );
  };

  // Handle orientation filter change
  const handleOrientationChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedOrientation(event.target.value as string);
    setStandardPage(1); // Reset pagination
    setSpecialPage(1);
  };

  // Handle clicking on a template to create grid - this function was causing the infinite loop
  const handleTemplateClick = (template: GridTemplate) => {
    // Create a deep copy of the template to prevent reference issues
    const templateCopy = JSON.parse(JSON.stringify(template));
    // Use setTimeout to break the rendering cycle
    setTimeout(() => {
      generateGrid(templateCopy);
    }, 0);
  };

  // Handle spacing change
  const handleSpacingChange = (_: Event, value: number | number[]) => {
    updateOptions({ cellSpacing: value as number });
  };

  return (
    <Box>
      {/* Filter and action controls */}
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid md={8} sm={8}>
            <FormControl size="small" fullWidth>
              <InputLabel>Orientation</InputLabel>
              <Select
                value={selectedOrientation}
                label="Orientation"
                onChange={handleOrientationChange as any}
              >
                <MenuItem value="all">All Layouts</MenuItem>
                <MenuItem value="portrait">Portrait</MenuItem>
                <MenuItem value="landscape">Landscape</MenuItem>
                <MenuItem value="square">Square</MenuItem>
                <MenuItem value="mixed">Mixed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid md={4} sm={4}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<AutoAwesomeIcon />}
              onClick={generateOptimizedGrid}
              disabled={images.length === 0}
              fullWidth
            >
              Auto Layout
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {/* Layout tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{ mb: 2 }}
          aria-label="layout tabs"
        >
          <Tab 
            icon={<GridViewIcon />} 
            iconPosition="start"
            label="Standard"
            id="layout-tab-0"
            aria-controls="layout-tabpanel-0"
          />
          <Tab 
            icon={<ViewQuiltIcon />} 
            iconPosition="start"
            label="Special"
            id="layout-tab-1"
            aria-controls="layout-tabpanel-1"
          />
        </Tabs>
      </Box>
      
      {/* Standard grid layouts */}
      <div
        role="tabpanel"
        hidden={tabValue !== 0}
        id="layout-tabpanel-0"
        aria-labelledby="layout-tab-0"
      >
        {tabValue === 0 && (
          <>
            <Grid container spacing={1}>
              {paginatedStandard.map((template, index) => (
                <Grid md={3} sm={4} xs={6} key={`standard-${index}`}>
                  <GridLayoutPreview 
                    template={template}
                    selected={isActive(template)}
                    onClick={() => handleTemplateClick(template)}
                  />
                </Grid>
              ))}
            </Grid>
            
            {/* Pagination */}
            {standardPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination 
                  count={standardPages}
                  page={standardPage}
                  onChange={(e, page) => setStandardPage(page)}
                  size="small"
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </div>
      
      {/* Special grid layouts */}
      <div
        role="tabpanel"
        hidden={tabValue !== 1}
        id="layout-tabpanel-1"
        aria-labelledby="layout-tab-1"
      >
        {tabValue === 1 && (
          <>
            <Grid container spacing={1}>
              {paginatedSpecial.map((template, index) => (
                <Grid md={3} sm={4} xs={6} key={`special-${index}`}>
                  <GridLayoutPreview 
                    template={template}
                    selected={isActive(template)}
                    onClick={() => handleTemplateClick(template)}
                  />
                </Grid>
              ))}
            </Grid>
            
            {/* Pagination */}
            {specialPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination 
                  count={specialPages}
                  page={specialPage}
                  onChange={(e, page) => setSpecialPage(page)}
                  size="small"
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </div>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Settings and Actions */}
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* Spacing Control */}
          <Grid md={6} sm={6} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Spacing: {options?.cellSpacing || 0}px
            </Typography>
            <Slider
              value={options?.cellSpacing || 0}
              onChange={handleSpacingChange}
              min={0}
              max={20}
              step={1}
              size="small"
            />
          </Grid>
          
          {/* Action Buttons */}
          <Grid md={6} sm={6} xs={12}>
            <Grid container spacing={1}>
              <Grid md={6} sm={6} xs={6}>
                <Button
                  variant="outlined"
                  startIcon={<ShuffleIcon />}
                  onClick={shuffleImages}
                  disabled={!grid || images.length === 0}
                  fullWidth
                >
                  Shuffle Images
                </Button>
              </Grid>
              <Grid md={6} sm={6} xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onExport}
                  disabled={!grid || images.length === 0}
                  fullWidth
                >
                  Export Collage
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      
      {/* Instructions */}
      <Box sx={{ mt: 2 }}>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center"
        >
          Select a layout, then drag images to slots
        </Typography>
      </Box>
    </Box>
  );
};

export default GridManager;