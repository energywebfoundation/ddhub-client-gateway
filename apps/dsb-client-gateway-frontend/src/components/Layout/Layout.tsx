import Sidebar from '../Sidebar/Sidebar';
import { useStyles } from './Layout.styles';
import Header from '../Header/Header';
import { Breadcrumbs } from '@ddhub-client-gateway-frontend/ui/core';
import { MobileUnsupported } from '../MobileUnsupported/MobileUnsupported';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout(props: LayoutProps) {
  const {classes} = useStyles();
  return (
    <>
      <div className={classes.root}>
        <Sidebar/>
        <div className={classes.content}>
          <Header />
          <div className={classes.childContent}>
            <Breadcrumbs />
            {props.children}
          </div>
        </div>
      </div>
      <MobileUnsupported />
    </>
  );
}

export default Layout;
