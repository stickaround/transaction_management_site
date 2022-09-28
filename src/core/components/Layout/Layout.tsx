import * as React from 'react';
import { styled, Box } from '@mui/material';

import { Header } from '../Header';
import { Footer } from '../Footer';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutWrapper>
      <ContentWrapper>
        <Box component='header'>
          <Header />
        </Box>
        <Box component='main' sx={{ flexGrow: 1 }}>
          <DrawerHeader />
          {children}
        </Box>
      </ContentWrapper>
      <Box component='footer'>
        <Footer />
      </Box>
    </LayoutWrapper>
  );
}

const LayoutWrapper = styled('div')`
  min-height: 100vh;
`;

const ContentWrapper = styled('div')`
  display: flex;
`;

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

export { Layout };
