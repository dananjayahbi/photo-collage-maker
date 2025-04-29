import React from 'react';
import { Box, Paper, Typography, Button, Stack, Grid } from '@mui/material';
import { GridViewRounded, AutoAwesomeRounded } from '@mui/icons-material';
import { useCollage } from '../Layout/CollageContext';

// Predefined grid templates
const GRID_TEMPLATES = [
  { name: '2x2', rows: 2, columns: 2 },
  { name: '2x3', rows: 2, columns: 3 },
  { name: '3x3', rows: 3, columns: 3 },
  { name: '4x3', rows: 4, columns: 3 },
  { name: '4x4', rows: 4, columns: 4 },
];

const GridManager: React.FC = () => {
  const { images, updateGrid, grid } = useCollage();

  // Apply a specific grid template
  const applyGridTemplate = (rows: number, columns: number) => {
    if (images.length === 0) return;

    // Calculate dimensions
    const canvasWidth = 1200;
    const aspectRatio = 16 / 9;
    const canvasHeight = canvasWidth / aspectRatio;
    
    const cellWidth = canvasWidth / columns;
    const cellHeight = canvasHeight / rows;
    
    // Create cells
    const cells = [];
    let imageIndex = 0;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        cells.push({
          id: `cell-${row}-${col}`,
          x: col * cellWidth,
          y: row * cellHeight,
          width: cellWidth,
          height: cellHeight,
          imageId: imageIndex < images.length ? images[imageIndex].id : undefined,
        });
        imageIndex++;
      }
    }
    
    updateGrid({
      rows,
      columns,
      width: canvasWidth,
      height: canvasHeight,
      cells,
    });
  };

  // Generate an AI-optimized grid (in this simplified version, just creates a grid based on image count)
  const generateOptimizedGrid = () => {
    if (images.length === 0) return;
    
    const count = images.length;
    let columns = Math.ceil(Math.sqrt(count * (16/9)));
    let rows = Math.ceil(count / columns);
    
    applyGridTemplate(rows, columns);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Grid Templates
      </Typography>
      
      <Stack spacing={2}>
        <Grid container spacing={2}>
          {GRID_TEMPLATES.map((template) => (
            <Grid item xs={6} sm={4} key={template.name}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => applyGridTemplate(template.rows, template.columns)}
                disabled={images.length === 0}
                startIcon={<GridViewRounded />}
                sx={{ justifyContent: 'flex-start' }}
              >
                {template.name}
              </Button>
            </Grid>
          ))}
        </Grid>
        
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AutoAwesomeRounded />}
          onClick={generateOptimizedGrid}
          disabled={images.length === 0}
          fullWidth
        >
          Optimize Grid Layout
        </Button>
      </Stack>
    </Paper>
  );
};

export default GridManager;