import React from 'react';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import { CollectionsTwoTone } from '@mui/icons-material';

const Header: React.FC = () => {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar sx={{ py: 1 }}>
          <CollectionsTwoTone sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Photo Collage Maker
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;