import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  TextField,
  Divider,
} from '@mui/material';
import {
  ShuffleRounded,
  GridViewRounded,
  SaveAltRounded,
  ColorLensRounded,
} from '@mui/icons-material';
import { useCollage } from '../Layout/CollageContext';
import { ImageFit } from '../../types';

interface ControlPanelProps {
  onExport: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onExport }) => {
  const { options, updateOptions, shuffleImages, generateGrid, grid } = useCollage();
  const [columns, setColumns] = useState<number>(4);
  const [rows, setRows] = useState<number>(3);
  
  const handleColumnsChange = (_: Event, value: number | number[]) => {
    setColumns(value as number);
  };
  
  const handleRowsChange = (_: Event, value: number | number[]) => {
    setRows(value as number);
  };
  
  const handleSpacingChange = (_: Event, value: number | number[]) => {
    updateOptions({ cellSpacing: value as number });
  };
  
  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateOptions({ backgroundColor: e.target.value });
  };
  
  const handleImageFitChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    updateOptions({ imageFit: e.target.value as ImageFit });
  };

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Collage Settings
      </Typography>
      
      <Stack spacing={3} sx={{ mt: 1 }}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Layout
          </Typography>
          
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" gutterBottom>
                Columns: {columns}
              </Typography>
              <Slider
                value={columns}
                onChange={handleColumnsChange}
                min={1}
                max={10}
                step={1}
                marks
                size="small"
              />
            </Box>
            
            <Box>
              <Typography variant="body2" gutterBottom>
                Rows: {rows}
              </Typography>
              <Slider
                value={rows}
                onChange={handleRowsChange}
                min={1}
                max={10}
                step={1}
                marks
                size="small"
              />
            </Box>
            
            <Button 
              variant="outlined" 
              startIcon={<GridViewRounded />}
              onClick={generateGrid}
              disabled={!grid}
              fullWidth
            >
              Update Grid
            </Button>
          </Stack>
        </Box>
        
        <Divider />
        
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Appearance
          </Typography>
          
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" gutterBottom>
                Spacing: {options.cellSpacing}px
              </Typography>
              <Slider
                value={options.cellSpacing}
                onChange={handleSpacingChange}
                min={0}
                max={20}
                step={1}
                size="small"
              />
            </Box>
            
            <Box>
              <Typography variant="body2" gutterBottom>
                Background Color
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: options.backgroundColor,
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                />
                <TextField
                  value={options.backgroundColor}
                  onChange={handleBackgroundColorChange}
                  size="small"
                  fullWidth
                  type="text"
                  placeholder="#ffffff"
                />
              </Box>
            </Box>
            
            <FormControl size="small" fullWidth>
              <InputLabel id="image-fit-label">Image Fit</InputLabel>
              <Select
                labelId="image-fit-label"
                value={options.imageFit}
                onChange={handleImageFitChange}
                label="Image Fit"
              >
                <MenuItem value="fill">Fill</MenuItem>
                <MenuItem value="contain">Contain</MenuItem>
                <MenuItem value="cover">Cover</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>
        
        <Divider />
        
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Actions
          </Typography>
          
          <Stack spacing={2}>
            <Button 
              variant="outlined" 
              startIcon={<ShuffleRounded />} 
              onClick={shuffleImages}
              disabled={!grid}
              fullWidth
            >
              Shuffle Images
            </Button>
            
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<SaveAltRounded />}
              onClick={onExport}
              disabled={!grid}
              fullWidth
            >
              Export Collage
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default ControlPanel;