import Sidebar from "../Sidebar/Sidebar";
import { makeStyles } from '@material-ui/core/styles';

/* eslint-disable-next-line */
export interface LayoutProps {
  children
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1
  },
}));
export function Layout(props: LayoutProps) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Sidebar />
      <div className={classes.content}>
        {props.children}
      </div>
    </div>
  );
}

export default Layout;
