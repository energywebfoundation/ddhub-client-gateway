import { Box, Typography } from '@mui/material';
import { AlertCircle, X } from 'react-feather';
import { useState } from 'react';

export function Banner({ text }: { text: string }) {
  const [show, setShow] = useState(true);

  if (!show) return null;
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        backgroundColor: 'rgba(164, 102, 255, 0.12)',
      }}
      height={40}
      width="100%"
      padding="0 16px"
      marginBottom={1}
    >
      <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
        <AlertCircle size={16} color="var(--primary-color)" />

        <Typography variant="body2" color="primary.main">
          {text}
        </Typography>
      </Box>
      <X
        size={16}
        color="var(--primary-color)"
        onClick={() => setShow(false)}
        style={{ cursor: 'pointer' }}
      />
    </Box>
  );
}
