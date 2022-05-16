import { useRouter } from 'next/router';
import { useStyles } from './MenuItem.styles';

export const useMenuItemEffects = () => {
  const { classes } = useStyles();
  const router = useRouter();

  const isActive = (pathname: string) =>
    router.pathname.startsWith(pathname) ? classes.active : '';

  return {
    isActive,
  };
};
