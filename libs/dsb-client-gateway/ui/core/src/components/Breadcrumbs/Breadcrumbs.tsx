import { Breadcrumbs as MuiBreadcrumbs, Typography, Box } from '@mui/material';
import { Home, ChevronRight } from 'react-feather';
import Link from 'next/link';
import clsx from 'clsx';
import { routerConst, theme } from '@dsb-client-gateway/ui/utils';
import { AppImage } from '@dsb-client-gateway/ui/core';
import { useBreadcrumbsEffects } from './Breadcrumbs.effects';
import { useStyles } from './Breadcrumbs.styles';

export function Breadcrumbs() {
  const { classes } = useStyles();
  const [item, ...list] = useBreadcrumbsEffects();

  const separator =
    list.length > 0 ? (
      <ChevronRight color={theme.palette.grey[600]} size={14} />
    ) : (
      ''
    );

  return (
    <section className={classes.root}>
      {item.imageUrl && (
        <AppImage src={item.imageUrl} className={classes.image} />
      )}
      <Typography variant="h5" className={classes.pageTitle}>
        {item.title}
      </Typography>
      <Box className={classes.line}></Box>
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
            key={item.title}
            variant="subtitle2"
            className={clsx(classes.element, {
              [classes.lastElement]: index === list.length - 1,
            })}
          >
            {item.title}
          </Typography>
        ))}
      </MuiBreadcrumbs>
    </section>
  );
}

export default Breadcrumbs;
