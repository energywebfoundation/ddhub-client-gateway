import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material';
import { Home } from 'react-feather';
import { useStyles } from './Breadcrumbs.styles';
import Link from 'next/link';
import { routerConst, theme } from '@dsb-client-gateway/ui/utils';
import { useBreadcrumbsEffects } from './Breadcrumbs.effects';
import { NavigateNext } from '@mui/icons-material';

export function Breadcrumbs() {
  const [title, ...list] = useBreadcrumbsEffects();
  const { classes } = useStyles();
  const separator = list.length > 0 ? <NavigateNext fontSize="small" /> : '';
  return (
    <section className={classes.root}>
      <Typography variant="h5" className={classes.pageTitle}>
        {title}
      </Typography>
      <Typography variant="h5">|</Typography>
      <MuiBreadcrumbs
        separator={separator}
        aria-label="breadcrumb"
        className={classes.breadCrumbs}
      >
        <Link href={routerConst.Dashboard}>
          <Home color={theme.palette.primary.main} size={15} />
        </Link>
        <div></div>
      </MuiBreadcrumbs>
      <MuiBreadcrumbs separator={separator} aria-label="breadcrumb">
        {list?.map((item, index, list) => (
          <Typography
            key={item}
            variant="subtitle2"
            className={
              index === list.length - 1
                ? classes.lastElement
                : classes.defaultElement
            }
          >
            {item}
          </Typography>
        ))}
      </MuiBreadcrumbs>
    </section>
  );
}

export default Breadcrumbs;
