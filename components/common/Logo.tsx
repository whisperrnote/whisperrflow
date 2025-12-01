'use client';

import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { APP_CONFIG } from '@/lib/constants';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  linkToHome?: boolean;
}

const sizeMap = {
  small: { image: 28, fontSize: '1rem' },
  medium: { image: 36, fontSize: '1.25rem' },
  large: { image: 48, fontSize: '1.5rem' },
};

export default function Logo({ size = 'medium', showText = true, linkToHome = true }: LogoProps) {
  const theme = useTheme();
  const dimensions = sizeMap[size];

  const content = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <Box
        sx={{
          width: dimensions.image,
          height: dimensions.image,
          borderRadius: 2,
          overflow: 'hidden',
          flexShrink: 0,
          boxShadow: `0 2px 8px rgba(0, 0, 0, 0.1)`,
        }}
      >
        <Image
          src={APP_CONFIG.logo.url}
          alt={APP_CONFIG.logo.alt}
          width={dimensions.image}
          height={dimensions.image}
          style={{ 
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
          priority
        />
      </Box>
      {showText && (
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: 700,
            fontSize: dimensions.fontSize,
            color: theme.palette.text.primary,
            letterSpacing: '-0.01em',
          }}
        >
          {APP_CONFIG.name}
        </Typography>
      )}
    </Box>
  );

  if (linkToHome) {
    return (
      <Link href="/dashboard" style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    );
  }

  return content;
}
