import { Typography } from '@mui/material';

import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

export type RolesCountdownProps = {
  refetch: () => void;
};

const REFRESH_INTERVAL = 60;

const formatLastUpdateTime = (date: Date): string => {
  const day = date.toLocaleDateString('en-US', { weekday: 'short' });
  const time = date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return `${day} ${time}`;
};

export function RolesCountdown({ refetch }: RolesCountdownProps) {
  const [countdown, setCountdown] = useState<number>(REFRESH_INTERVAL);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  useEffect(() => {
    setLastUpdateTime(new Date());

    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          refetch();
          setLastUpdateTime(new Date()); // Update timestamp when countdown resets
          return REFRESH_INTERVAL; // Reset to 60 when reaching 0
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <CircularProgress size={16} color="primary" />
      <Typography variant="body2" color="text.primary">
        Next refresh in {countdown} seconds.
        {lastUpdateTime && (
          <> Updated: {formatLastUpdateTime(lastUpdateTime)}</>
        )}
      </Typography>
    </>
  );
}
