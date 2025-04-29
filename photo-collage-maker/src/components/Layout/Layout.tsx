import React, { ReactNode } from 'react';
import { Container, Box } from '@mui/material';
import Header from './Header';
import { CollageProvider } from './CollageContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <CollageProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container 
          component="main" 
          maxWidth="lg" 
          sx={{ 
            flexGrow: 1, 
            py: 4,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {children}
        </Container>
        <Box 
          component="footer" 
          sx={{ 
            py: 3, 
            mt: 'auto', 
            backgroundColor: 'background.paper', 
            borderTop: '1px solid', 
            borderColor: 'divider',
            textAlign: 'center'
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ color: 'text.secondary', fontSize: 14 }}>
              © {new Date().getFullYear()} Photo Collage Maker - Create beautiful photo compositions
            </Box>
          </Container>
        </Box>
      </Box>
    </CollageProvider>
  );
};

export default Layout;