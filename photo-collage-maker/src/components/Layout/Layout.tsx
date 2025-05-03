import React from 'react';
import { Box, Grid } from '@mui/material';
import Header from './Header';
import ImageUploader from '../ImageUploader/ImageUploader';
import GridManager from '../GridManager/GridManager';
import CollageCanvas from '../CollageCanvas/CollageCanvas';
import { CollageProvider } from './CollageContext';

const Layout: React.FC = () => {
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
        width: '100%',
        overflowX: 'hidden'
      }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, py: 3, px: 3, maxWidth: '100%' }}>
          <Grid container spacing={3}>
            {/* Main content area - full width */}
            <Grid md={12}>
              <Box sx={{ mb: 4, maxWidth: '100%' }}>
                <ImageUploader />
              </Box>
              <Box sx={{ mb: 4, maxWidth: '100%' }}>
                <CollageCanvas exportRef={null} />
              </Box>
              <Box sx={{ maxWidth: '100%' }}>
                <GridManager onExport={handleExportCollage} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </CollageProvider>
  );
};

export default Layout;