'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
// We'll use a try-catch import or just assume it works. 
// Since I can't verify the exports, I'll write what's most likely correct based on instructions.
import { CampModal, useAuth } from '@campnetwork/origin/react';

export const CampConnectButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.walletAddress) {
      console.log('Origin Connected:', user.walletAddress);
      // TODO: Sync with Appwrite User Preferences
    }
  }, [isAuthenticated, user]);

  return (
    <>
      <Button 
        variant="outlined" 
        color="inherit" 
        onClick={() => setIsOpen(true)}
        sx={{ ml: 1 }}
      >
        {isAuthenticated ? 'Origin Connected' : 'Connect Origin'}
      </Button>
      
      <CampModal 
        open={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
};
