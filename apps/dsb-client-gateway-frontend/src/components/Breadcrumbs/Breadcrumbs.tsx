import { Typography } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { Home } from 'react-feather';
import { useStyles } from './Breadcrumbs.styles';
import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';
import { useRouter } from 'next/router';
import { getBreadcrumbsFromPathname } from './Breadcrumbs.effects';

export function Breadcrumbs() {
  const router = useRouter();
  const {classes} = useStyles();

  const [main, text] = getBreadcrumbsFromPathname(router.pathname);

  const separator = text ? <NavigateNext fontSize="small"/> : '';

  return (
    <section className={classes.root}>
      <Typography variant="h5" className={classes.pageTitle}>{main}</Typography>
      <Typography variant="h5">|</Typography>
      <MuiBreadcrumbs separator={separator} aria-label="breadcrumb" className={classes.breadCrumbs}>
        <Home color="#A466FF" size={15}/>
        <Typography color="primary">{text}</Typography>
      </MuiBreadcrumbs>
    </section>
  );
}

export default Breadcrumbs;
