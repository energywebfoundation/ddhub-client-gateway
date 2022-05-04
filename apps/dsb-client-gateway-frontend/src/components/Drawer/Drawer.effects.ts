import { useRouter } from 'next/router';
import { useStyles } from './Drawer.styles';

export const useDrawerEffects = () => {
  const { classes } = useStyles();
  const router = useRouter();

  const isActive = (pathname: string) =>
    router.pathname.startsWith(pathname) ? classes.active : '';

  return {
    isActive,
  };
};
