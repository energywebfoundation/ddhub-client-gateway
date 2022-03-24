import Sidebar from '../Sidebar/Sidebar';
import { useStyles } from './Layout.styles';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout(props: LayoutProps) {
  const {classes} = useStyles();
  return (
    <div className={classes.root}>
      <Sidebar/>
      <div className={classes.content}>
        {props.children}
      </div>
    </div>
  );
}

export default Layout;
