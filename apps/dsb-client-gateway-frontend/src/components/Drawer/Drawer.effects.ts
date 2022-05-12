import { useState } from 'react';
import { useRouter } from 'next/router';
import { useStyles } from './Drawer.styles';

export const useDrawerEffects = () => {
  const { classes } = useStyles();
  const [dataOpen, setDataOpen] = useState(false);
  const [largeDataOpen, setLargeDataOpen] = useState(false);
  const router = useRouter();

  const handleDataOpen = () => {
    setDataOpen(!dataOpen);
  };

  const handleLargeDataOpen = () => {
    setLargeDataOpen(!largeDataOpen);
  };

  const isActive = (pathname: string) =>
    router.pathname.startsWith(pathname) ? classes.active : '';

  return {
    isActive,
    dataOpen,
    handleDataOpen,
    largeDataOpen,
    handleLargeDataOpen,
  };
};
