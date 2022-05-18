import Sidebar from '../Sidebar/Sidebar';
import { useStyles } from './Layout.styles';
import Header from '../Header/Header';
import { Breadcrumbs } from '@ddhub-client-gateway-frontend/ui/core';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout(props: LayoutProps) {
  const {classes} = useStyles();
  return (
    <div className={classes.root}>
      <Sidebar/>
      <div className={classes.content}>
        <Header />
        <Breadcrumbs />
        {props.children}
      </div>
    </div>
  );
}

export default Layout;
