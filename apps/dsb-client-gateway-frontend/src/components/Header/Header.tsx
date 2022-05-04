import { useStyles } from './Header.styles';
import { didFormatMinifier } from '@dsb-client-gateway/ui/utils';
import { useHeaderEffects } from './Header.effects';

export function Header() {
  const {classes} = useStyles();
  const {did} = useHeaderEffects();

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div>{didFormatMinifier(did)}</div>
        <div>Client gateway</div>
      </div>
      <div className={classes.avatar}/>
    </div>
  );
}

export default Header;
