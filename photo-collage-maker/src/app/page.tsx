'use client';

import React, { useState, useRef } from 'react';
import { 
  Box, 
  Dialog, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Paper,
  Grid
} from '@mui/material';
import Layout from '../components/Layout/Layout';
import ImageUploader from '../components/ImageUploader/ImageUploader';
import CollageCanvas from '../components/CollageCanvas/CollageCanvas';

export default function Home() {
  const [exportedImage, setExportedImage] = useState<string | null>(null);
  const exportRef = useRef<(() => Promise<string | null>) | null>(null);

  // Handle exporting the collage
  const handleExport = async () => {
    if (exportRef.current) {
      try {
        // exportRef.current() now returns a Promise, so we need to await it
        const dataUrl = await exportRef.current();
        if (dataUrl) {
          setExportedImage(dataUrl);
        }
      } catch (error) {
        console.error("Error exporting collage:", error);
        // Optionally show an error message to the user
      }
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
      <Grid container spacing={2}>
        {/* Main content area - Canvas */}
        <Grid item xs={12} md={9}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2, mb: 2, flexGrow: 1 }}>
              <CollageCanvas exportRef={exportRef} />
            </Paper>
            
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              onClick={handleExport}
              sx={{ mt: 2 }}
              fullWidth
            >
              Export Collage
            </Button>
          </Box>
        </Grid>

        {/* Image uploader section */}
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2, height: '100%' }}>
            <ImageUploader />
          </Paper>
        </Grid>
      </Grid>

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
