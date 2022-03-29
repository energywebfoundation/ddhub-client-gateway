import { useStyles } from './Header.styles';
import { didFormatMinifier } from '../../utils/did-format-minifier';

export function Header() {
  const {classes} = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div>{didFormatMinifier('did:ethr:volta:00111333333444444555556666677701010')}</div>
        <div>Client gateway</div>
      </div>
      <div className={classes.avatar} />
    </div>
  );
}

export default Header;
