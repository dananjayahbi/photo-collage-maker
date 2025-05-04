import React from 'react';
import { Box, Typography, Slider } from '@mui/material';
import { useCollage } from '../Layout/CollageContext';

const RowHeightSlider: React.FC = () => {
  const { options, updateOptions } = useCollage();
  
  const handleRowHeightChange = (_: Event, value: number | number[]) => {
    updateOptions({ rowHeight: value as number });
  };
  
  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Typography variant="body2" gutterBottom>
        Row Height: {options.rowHeight.toFixed(1)}x
      </Typography>
      <Slider
        value={options.rowHeight}
        onChange={handleRowHeightChange}
        min={0.5}
        max={3}
        step={0.1}
        marks={[
          { value: 0.5, label: '0.5x' },
          { value: 1, label: '1x' },
          { value: 2, label: '2x' },
          { value: 3, label: '3x' },
        ]}
        size="small"
      />
    </Box>
  );
};

export default RowHeightSlider;