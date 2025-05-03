import React from 'react';
import { Box, Grid, Paper } from '@mui/material';
import Header from './Header';
import GridManager from '../GridManager/GridManager';
import { CollageProvider } from './CollageContext';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const handleExportCollage = () => {
    const canvas = document.getElementById('collage-canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'collage.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <CollageProvider>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden'
      }}>
        <Header />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'row', 
          flexGrow: 1,
          width: '100%'
        }}>
          {/* Layout Sidebar */}
          <Box 
            component={Paper} 
            elevation={3} 
            sx={{ 
              width: { xs: '80px', sm: '220px' },
              p: 2,
              m: 1,
              flexShrink: 0,
              overflowY: 'auto',
              height: 'calc(100vh - 100px)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <GridManager onExport={handleExportCollage} />
          </Box>
          
          {/* Main content area */}
          <Box sx={{ 
            p: 2, 
            flexGrow: 1, 
            width: { xs: 'calc(100% - 100px)', sm: 'calc(100% - 240px)' },
            overflowY: 'auto'
          }}>
            {children}
          </Box>
        </Box>
      </Box>
    </CollageProvider>
  );
};

export default Layout;