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
  Popover,
} from '@mui/material';
import {
  ShuffleRounded,
  GridViewRounded,
  SaveAltRounded,
  ColorLensRounded,
} from '@mui/icons-material';
import { useCollage } from '../Layout/CollageContext';
import ColorizeIcon from '@mui/icons-material/Colorize';
import RowHeightSlider from './RowHeightSlider';

// Color picker component
const ColorPicker: React.FC<{
  value: string;
  onChange: (color: string) => void;
}> = ({ value, onChange }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [inputValue, setInputValue] = useState(value);

  const colorPresets = [
    '#ffffff', '#f5f5f5', '#e0e0e0', '#000000',
    '#ff0000', '#e91e63', '#9c27b0', '#673ab7',
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39',
    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
  ];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    if (isValidHexColor(inputValue)) {
      onChange(inputValue);
    } else {
      setInputValue(value);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleColorPresetClick = (color: string) => {
    setInputValue(color);
    onChange(color);
  };

  const handleInputBlur = () => {
    if (isValidHexColor(inputValue)) {
      onChange(inputValue);
    } else {
      setInputValue(value);
    }
  };

  const isValidHexColor = (color: string) => {
    return /^#([A-Fa-f0-9]{3}){1,2}$/.test(color);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'color-popover' : undefined;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Button
        aria-describedby={id}
        variant="outlined"
        onClick={handleClick}
        startIcon={<ColorizeIcon />}
        sx={{ mr: 1, minWidth: '120px' }}
      >
        <Box
          sx={{
            width: 20,
            height: 20,
            backgroundColor: isValidHexColor(value) ? value : '#ffffff',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <Box component="span" sx={{ ml: 1 }}>
          Color
        </Box>
      </Button>
      <TextField
        value={inputValue}
        onChange={handleColorChange}
        onBlur={handleInputBlur}
        size="small"
        placeholder="#RRGGBB"
        sx={{ flexGrow: 1 }}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ p: 2, width: '300px' }}>
          <Typography variant="subtitle2" gutterBottom>Select Color</Typography>

          <Box sx={{ mb: 2 }}>
            <input
              type="color"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{ width: '100%', height: '40px' }}
            />
          </Box>

          <Typography variant="subtitle2" gutterBottom>Presets</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            {colorPresets.map((color) => (
              <Box
                key={color}
                onClick={() => handleColorPresetClick(color)}
                sx={{
                  width: 30,
                  height: 30,
                  backgroundColor: color,
                  cursor: 'pointer',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: 1
                  }
                }}
              />
            ))}
          </Box>

          <TextField
            fullWidth
            value={inputValue}
            onChange={handleColorChange}
            margin="normal"
            size="small"
            label="Hex Color"
            placeholder="#RRGGBB"
            error={!isValidHexColor(inputValue)}
            helperText={!isValidHexColor(inputValue) ? 'Invalid hex color' : ''}
          />
        </Box>
      </Popover>
    </Box>
  );
};

interface ControlPanelProps {
  onExport: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onExport }) => {
  const { options, updateOptions, shuffleImages, grid, images, generateGrid } = useCollage();
  const [columns, setColumns] = useState<number>(4);
  const [rows, setRows] = useState<number>(3);
  
  // Create local reference to rowHeight for the slider
  const [rowHeightValue, setRowHeightValue] = useState<number>(options.rowHeight);

  const handleColumnsChange = (_: Event, value: number | number[]) => {
    setColumns(value as number);
  };

  const handleRowsChange = (_: Event, value: number | number[]) => {
    setRows(value as number);
  };

  const handleGenerateGrid = () => {
    generateGrid({ 
      name: `${rows} × ${columns}`, 
      type: 'standard', 
      rows, 
      columns 
    });
  };

  const handleSpacingChange = (_: Event, value: number | number[]) => {
    updateOptions({ cellSpacing: value as number });
  };

  const handleRowHeightChange = (_: Event, value: number | number[]) => {
    const newHeight = value as number;
    setRowHeightValue(newHeight);
    updateOptions({ rowHeight: newHeight });
  };

  const handleBackgroundColorChange = (color: string) => {
    updateOptions({ backgroundColor: color });
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
              onClick={handleGenerateGrid}
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
                value={options.cellSpacing || 0}
                onChange={handleSpacingChange}
                min={0}
                max={20}
                step={1}
                size="small"
              />
            </Box>

            <RowHeightSlider />

            <Box>
              <Typography variant="body2" gutterBottom>
                Background Color
              </Typography>
              <ColorPicker
                value={options.backgroundColor}
                onChange={handleBackgroundColorChange}
              />
            </Box>
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
              disabled={!grid || images.length === 0}
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