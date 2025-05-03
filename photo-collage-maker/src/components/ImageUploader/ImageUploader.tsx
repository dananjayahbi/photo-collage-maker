'use client';

import React, { useRef, useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  IconButton,
  Paper,
  Divider,
  Alert
} from '@mui/material';
import { useCollage } from '../Layout/CollageContext';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const ImageUploader: React.FC = () => {
  const { images, addImage, removeImage } = useCollage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          if (dataUrl) {
            addImage(file, dataUrl);
          }
        };
        reader.readAsDataURL(file);
      });
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Open file selector
  const handleSelectFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle drag events for the uploader area
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          if (dataUrl) {
            addImage(file, dataUrl);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle drag start for image list items (for drag to grid cells)
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('imageId', id);
    
    // Create a ghost image for dragging
    const image = images.find(img => img.id === id);
    if (image?.dataUrl) {
      const ghostImg = new Image();
      ghostImg.src = image.dataUrl;
      ghostImg.style.width = '100px';
      ghostImg.style.height = '100px';
      ghostImg.style.objectFit = 'cover';
      document.body.appendChild(ghostImg);
      e.dataTransfer.setDragImage(ghostImg, 50, 50);
      setTimeout(() => {
        document.body.removeChild(ghostImg);
      }, 0);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Images</Typography>
      
      {/* Drag & drop area or button */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mb: 2,
          textAlign: 'center',
          backgroundColor: isDragging ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
          borderColor: isDragging ? 'primary.main' : 'divider',
          borderStyle: isDragging ? 'dashed' : 'solid',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleSelectFiles}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 1
        }}>
          <AddPhotoAlternateIcon color="primary" fontSize="large" />
          <Typography variant="body2">
            {isDragging ? 'Drop images here' : 'Drag & drop images or click to select'}
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </Box>
      </Paper>
      
      {/* Images list */}
      {images.length > 0 ? (
        <>
          <Typography variant="subtitle2" gutterBottom>
            {`Uploaded Images (${images.length})`}
          </Typography>
          
          {/* Instructions for drag and drop */}
          <Alert severity="info" sx={{ mb: 2, fontSize: '0.75rem' }}>
            Drag images to grid slots to add them to your collage
          </Alert>
          
          <Box sx={{ maxHeight: '300px', overflow: 'auto', mb: 2 }}>
            <List dense disablePadding>
              {images.map((image, index) => (
                <React.Fragment key={image.id}>
                  {index > 0 && <Divider variant="inset" component="li" />}
                  <ListItem
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        aria-label="delete" 
                        onClick={() => removeImage(image.id)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                    sx={{
                      cursor: 'grab',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      },
                    }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, image.id)}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        variant="rounded" 
                        src={image.dataUrl} 
                        alt={`Image ${index + 1}`}
                        sx={{ width: 40, height: 40, mr: 1 }}
                      />
                    </ListItemAvatar>
                    <ListItemText 
                      primary={`Image ${index + 1}`} 
                      secondary={
                        <Box component="span" sx={{ fontSize: '0.7rem' }}>
                          {image.file.name.substring(0, 15)}
                          {image.file.name.length > 15 ? '...' : ''}
                        </Box>
                      }
                    />
                    <DragIndicatorIcon 
                      color="action" 
                      fontSize="small"
                      sx={{ opacity: 0.5, mr: 1 }}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Box>
        </>
      ) : (
        <Typography color="text.secondary" align="center" sx={{ mt: 4, mb: 4 }}>
          No images uploaded yet
        </Typography>
      )}
    </Box>
  );
};

export default ImageUploader;