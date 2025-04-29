import React, { useRef, useState } from 'react';
import { Box, Button, Typography, Stack, Paper, IconButton } from '@mui/material';
import { AddPhotoAlternate, Delete } from '@mui/icons-material';
import { useCollage } from '../Layout/CollageContext';
import { CollageImage } from '../../types';

const ImageUploader: React.FC = () => {
  const { images, addImages, removeImage, generateGrid } = useCollage();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      await addImages(Array.from(files));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      await addImages(Array.from(files));
    }
  };

  const handleImageClick = (id: string) => {
    // Handle image selection logic here
  };

  const handleCreateCollage = () => {
    if (images.length > 0) {
      generateGrid();
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Upload Images
      </Typography>
      
      <Box
        sx={{
          border: '2px dashed',
          borderColor: isDragging ? 'primary.main' : 'grey.400',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          backgroundColor: isDragging ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
          transition: 'all 0.2s',
          mb: 2,
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
        <AddPhotoAlternate fontSize="large" color="primary" />
        <Typography variant="body1" sx={{ mt: 1 }}>
          Drag & drop images here
        </Typography>
        <Typography variant="body2" color="textSecondary">
          or
        </Typography>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => fileInputRef.current?.click()}
          sx={{ mt: 1 }}
        >
          Browse Files
        </Button>
      </Box>

      {images.length > 0 && (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Selected Images ({images.length})
          </Typography>
          
          <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
            <Stack spacing={1}>
              {images.map((image: CollageImage) => (
                <Box
                  key={image.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                  onClick={() => handleImageClick(image.id)}
                >
                  <Box
                    component="img"
                    src={image.url}
                    alt={image.file.name}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 1,
                      mr: 1,
                    }}
                  />
                  <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <Typography variant="body2" noWrap title={image.file.name}>
                      {image.file.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {Math.round(image.width)}x{Math.round(image.height)} • 
                      {(image.file.size / 1024 / 1024).toFixed(1)} MB
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          </Box>

          <Button 
            variant="contained" 
            color="primary" 
            fullWidth
            onClick={handleCreateCollage}
            disabled={images.length === 0}
          >
            Create Collage
          </Button>
        </>
      )}
    </Paper>
  );
};

export default ImageUploader;