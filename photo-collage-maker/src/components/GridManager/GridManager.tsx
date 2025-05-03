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

// Modified GridLayoutPreview component with smaller previews that fit in a sidebar
const GridLayoutPreview: React.FC<GridLayoutPreviewProps> = ({ template, selected, onClick }) => {
  const theme = useTheme();
  
  const renderPreview = () => {
    const cells = [];
    const gap = '1px';
    
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
              height: '50px', // Smaller height for sidebar
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
              height: '50px', // Smaller height for sidebar
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
              height: '50px', // Smaller height for sidebar
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
              height: '50px', // Smaller height for sidebar
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
              height: '50px', // Smaller height for sidebar
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
              height: '50px', // Smaller height for sidebar
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
              height: '50px', // Smaller height for sidebar
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

      case 'custom':
        // Custom layouts based on variant
        switch(template.variant) {
          case 'pyramid':
            return (
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateAreas: `
                    "top top top"
                    "mid-left mid-center mid-right"
                    "bottom-1 bottom-2 bottom-3"
                  `,
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  gap,
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                }}
                onClick={onClick}
              >
                <Box sx={{ gridArea: 'top', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'mid-left', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'mid-center', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'mid-right', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'bottom-1', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'bottom-2', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'bottom-3', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
              </Box>
            );
          
          case 'inverted-pyramid':
            return (
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateAreas: `
                    "top-1 top-2 top-3"
                    "mid-left mid-center mid-right"
                    "bottom bottom bottom"
                  `,
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  gap,
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                }}
                onClick={onClick}
              >
                <Box sx={{ gridArea: 'top-1', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'top-2', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'top-3', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'mid-left', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'mid-center', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'mid-right', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'bottom', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
              </Box>
            );

          case 'pentagon':
            return (
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateAreas: `
                    ". top ."
                    "mid-left mid-right ."
                    "bottom-left bottom-center bottom-right"
                  `,
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  gap,
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                }}
                onClick={onClick}
              >
                <Box sx={{ gridArea: 'top', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'mid-left', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'mid-right', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'bottom-left', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'bottom-center', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'bottom-right', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
              </Box>
            );

          case 'circle':
            return (
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateAreas: `
                    ". top ."
                    "left . right"
                    ". bottom ."
                  `,
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  gap,
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                }}
                onClick={onClick}
              >
                <Box sx={{ gridArea: 'top', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'left', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'right', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'bottom', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
              </Box>
            );

          case 'polaroid':
            return (
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateAreas: `
                    "main main main"
                    "main main main"
                    "small-1 small-2 small-3"
                  `,
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: '2fr 2fr 1fr',
                  gap,
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                }}
                onClick={onClick}
              >
                <Box sx={{ gridArea: 'main', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'small-1', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'small-2', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'small-3', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
              </Box>
            );

          case 'gallery':
            return (
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gridAutoRows: '10px',
                  gap,
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                }}
                onClick={onClick}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <Box 
                    key={i}
                    sx={{ 
                      backgroundColor: selected ? 'primary.main' : 'primary.light',
                      borderRadius: '2px',
                      gridRow: `span ${i % 3 + 1}`,
                    }} 
                  />
                ))}
              </Box>
            );

          case 'timeline':
            return (
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateRows: 'repeat(1, 1fr)',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap,
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                }}
                onClick={onClick}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Box 
                    key={i}
                    sx={{ 
                      backgroundColor: selected ? 'primary.main' : 'primary.light',
                      borderRadius: '2px',
                    }} 
                  />
                ))}
              </Box>
            );

          case 'spiral':
            return (
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateAreas: `
                    "a b c"
                    "h i d"
                    "g f e"
                  `,
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  gap,
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                }}
                onClick={onClick}
              >
                <Box sx={{ gridArea: 'a', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'b', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'c', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'd', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'e', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'f', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'g', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'h', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'i', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
              </Box>
            );

          case 'T-shape':
            return (
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateAreas: `
                    "top top top"
                    ". middle ."
                    ". bottom ."
                  `,
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  gap,
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                }}
                onClick={onClick}
              >
                <Box sx={{ gridArea: 'top', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'middle', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'bottom', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
              </Box>
            );

          case 'L-shape':
            return (
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateAreas: `
                    "left . ."
                    "left . ."
                    "bottom bottom bottom"
                  `,
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  gap,
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                }}
                onClick={onClick}
              >
                <Box sx={{ gridArea: 'left', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'bottom', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
              </Box>
            );

          case 'cross':
            return (
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateAreas: `
                    ". top ."
                    "left center right"
                    ". bottom ."
                  `,
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  gap,
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                }}
                onClick={onClick}
              >
                <Box sx={{ gridArea: 'top', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'left', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'center', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'right', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'bottom', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
              </Box>
            );

          case 'diagonal':
            return (
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateAreas: `
                    "top . ."
                    ". middle ."
                    ". . bottom"
                  `,
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  gap,
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                }}
                onClick={onClick}
              >
                <Box sx={{ gridArea: 'top', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'middle', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'bottom', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
              </Box>
            );

          case 'stacked':
            return (
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap,
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                }}
                onClick={onClick}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <Box 
                    key={i}
                    sx={{ 
                      backgroundColor: selected ? 'primary.main' : 'primary.light',
                      borderRadius: '2px',
                      transform: `translateX(${i % 2 === 0 ? '-2px' : '2px'})`,
                    }} 
                  />
                ))}
              </Box>
            );

          case '2+3':
            return (
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateAreas: `
                    "top-left top-right"
                    "bottom bottom"
                    "bottom bottom"
                  `,
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gridTemplateRows: '1fr 2fr',
                  gap,
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                }}
                onClick={onClick}
              >
                <Box sx={{ gridArea: 'top-left', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'top-right', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'bottom', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
              </Box>
            );

          case '3+2':
            return (
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateAreas: `
                    "top top"
                    "top top"
                    "bottom-left bottom-right"
                  `,
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gridTemplateRows: '2fr 1fr',
                  gap,
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                }}
                onClick={onClick}
              >
                <Box sx={{ gridArea: 'top', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'bottom-left', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
                <Box sx={{ gridArea: 'bottom-right', backgroundColor: selected ? 'primary.main' : 'primary.light', borderRadius: '2px' }} />
              </Box>
            );

          default:
            return (
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  gap,
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                }}
                onClick={onClick}
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <Box 
                    key={i}
                    sx={{ 
                      backgroundColor: selected ? 'primary.main' : 'primary.light',
                      borderRadius: '2px',
                    }} 
                  />
                ))}
              </Box>
            );
        }

      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={selected ? 3 : 1}
      sx={{ 
        p: 0.5,
        borderRadius: 1,
        transition: 'all 0.2s',
        border: selected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
        mb: 1, // Add margin bottom for vertical stacking
      }}
    >
      <Typography variant="caption" align="center" display="block" sx={{ fontSize: '0.7rem', mb: 0.5, fontWeight: selected ? 'bold' : 'normal' }}>
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
  
  // Reduced items per page for sidebar
  const ITEMS_PER_PAGE = 6;
  
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

  // Handle clicking on a template to create grid
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
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%'
    }}>
      <Typography variant="subtitle1" gutterBottom>Layouts</Typography>
      
      {/* Filter dropdown */}
      <FormControl size="small" fullWidth sx={{ mb: 1 }}>
        <InputLabel>Orientation</InputLabel>
        <Select
          value={selectedOrientation}
          label="Orientation"
          onChange={handleOrientationChange as any}
          size="small"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="portrait">Portrait</MenuItem>
          <MenuItem value="landscape">Landscape</MenuItem>
          <MenuItem value="square">Square</MenuItem>
          <MenuItem value="mixed">Mixed</MenuItem>
        </Select>
      </FormControl>
      
      {/* Auto Layout Button */}
      <Button
        variant="outlined"
        color="primary"
        size="small"
        startIcon={<AutoAwesomeIcon />}
        onClick={generateOptimizedGrid}
        disabled={images.length === 0}
        fullWidth
        sx={{ mb: 2 }}
      >
        Auto Layout
      </Button>
      
      {/* Layout tabs */}
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        variant="fullWidth"
        size="small"
        sx={{ mb: 1, minHeight: '36px' }}
        aria-label="layout tabs"
      >
        <Tab 
          icon={<GridViewIcon fontSize="small" />} 
          aria-label="Standard layouts"
          sx={{ minHeight: '36px', p: 0 }}
        />
        <Tab 
          icon={<ViewQuiltIcon fontSize="small" />} 
          aria-label="Special layouts"
          sx={{ minHeight: '36px', p: 0 }}
        />
      </Tabs>
      
      {/* Layout panel - take most of the space and be scrollable */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          p: 1, 
          border: '1px solid #eee', 
          borderRadius: 1,
          mb: 1
        }}
      >
        {/* Standard grid layouts */}
        <Box
          role="tabpanel"
          hidden={tabValue !== 0}
          id="layout-tabpanel-0"
          aria-labelledby="layout-tab-0"
        >
          {tabValue === 0 && (
            <>
              {paginatedStandard.map((template, index) => (
                <GridLayoutPreview 
                  key={`standard-${index}`}
                  template={template}
                  selected={isActive(template)}
                  onClick={() => handleTemplateClick(template)}
                />
              ))}
              
              {/* Pagination */}
              {standardPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
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
        </Box>
        
        {/* Special grid layouts */}
        <Box
          role="tabpanel"
          hidden={tabValue !== 1}
          id="layout-tabpanel-1"
          aria-labelledby="layout-tab-1"
        >
          {tabValue === 1 && (
            <>
              {paginatedSpecial.map((template, index) => (
                <GridLayoutPreview 
                  key={`special-${index}`}
                  template={template}
                  selected={isActive(template)}
                  onClick={() => handleTemplateClick(template)}
                />
              ))}
              
              {/* Pagination */}
              {specialPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
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
        </Box>
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      {/* Settings and Actions at the bottom */}
      <Box>
        {/* Spacing Control */}
        <Typography variant="caption" gutterBottom>
          Spacing: {options?.cellSpacing || 0}px
        </Typography>
        <Slider
          value={options?.cellSpacing || 0}
          onChange={handleSpacingChange}
          min={0}
          max={20}
          step={1}
          size="small"
          sx={{ mb: 2 }}
        />
        
        {/* Action Buttons */}
        <Button
          variant="outlined"
          startIcon={<ShuffleIcon />}
          onClick={shuffleImages}
          disabled={!grid || images.length === 0}
          fullWidth
          size="small"
          sx={{ mb: 1 }}
        >
          Shuffle
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onExport}
          disabled={!grid || images.length === 0}
          fullWidth
          size="small"
        >
          Export
        </Button>
      </Box>
    </Box>
  );
};

export default GridManager;