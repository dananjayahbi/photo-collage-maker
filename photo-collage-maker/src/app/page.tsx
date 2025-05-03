'use client';

import React, { useState } from 'react';
import { Box, Dialog, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material';
import Layout from '../components/Layout/Layout';
import ImageUploader from '../components/ImageUploader/ImageUploader';
import CollageCanvas from '../components/CollageCanvas/CollageCanvas';
import ControlPanel from '../components/ControlPanel/ControlPanel';
import GridManager from '../components/GridManager/GridManager';

export default function Home() {
  const [exportedImage, setExportedImage] = useState<string | null>(null);

  // Handle exporting the collage
  const handleExport = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      setExportedImage(dataUrl);
    }
  };

  // Close the export dialog
  const handleCloseExport = () => {
    setExportedImage(null);
  };

  // Download the exported image
  const handleDownload = () => {
    if (!exportedImage) return;
    
    const link = document.createElement('a');
    link.download = `collage-${new Date().getTime()}.png`;
    link.href = exportedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    handleCloseExport();
  };

  return (
    <Layout>
      <Box className="collage-workspace" sx={{ flexGrow: 1, gap: 3 }}>
        <Box sx={{ width: { xs: '100%', md: '25%' }, mb: { xs: 3, md: 0 } }}>
          <ImageUploader />
        </Box>
        
        <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', flexDirection: 'column', mb: { xs: 3, md: 0 } }}>
          <GridManager />
          <CollageCanvas onExport={setExportedImage} />
        </Box>
        
        <Box sx={{ width: { xs: '100%', md: '25%' } }}>
          <ControlPanel onExport={handleExport} />
        </Box>
      </Box>

      {/* Export Dialog */}
      <Dialog
        open={Boolean(exportedImage)}
        onClose={handleCloseExport}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {exportedImage && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Your Collage is Ready!
              </Typography>
              <Box
                component="img"
                src={exportedImage}
                alt="Exported Collage"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  boxShadow: 3,
                  borderRadius: 1,
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExport}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownload}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
