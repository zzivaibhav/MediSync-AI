import React from 'react';
import { Box } from '@mui/material';

export const HexagonalAvatar = ({ name, size = 60, colors }) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <Box
      sx={{
        width: size,
        height: size,
        position: 'relative',
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: size * 0.4,
        fontWeight: 'bold',
        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
        '&:hover': {
          transform: 'scale(1.05)',
          transition: 'transform 0.3s ease'
        }
      }}
    >
      {initials}
    </Box>
  );
};
