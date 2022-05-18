import { ReactElement } from 'react';
import Sweetalert, { SweetAlertIcon } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { AlertCircle, Check, Info, HelpCircle, XCircle } from 'react-feather';
import { useStyles } from './Swal.styles';

const SwalCustom = withReactContent(Sweetalert);

export interface SwalProps {
  title: string;
  type: SweetAlertIcon;
  text?: string;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  width?: string;
}

export const Swal = () => {
  const { classes, theme } = useStyles();

  const icons: Record<SweetAlertIcon, ReactElement> = {
    warning: <AlertCircle style={{ stroke: theme.palette.error.main }} />,
    success: <Check className={classes.successIcon} />,
    error: <XCircle style={{ stroke: theme.palette.error.main }} />,
    question: <HelpCircle />,
    info: <Info />,
  };

  return ({
    title,
    type,
    text,
    showCancelButton,
    confirmButtonText,
    width,
  }: SwalProps) =>
    SwalCustom.mixin({
      title,
      iconHtml: icons[type],
      text,
      showCancelButton,
      confirmButtonText: confirmButtonText ?? 'Confirm',
      width: width ?? '512px',
      customClass: {
        icon: classes.icon,
        title: classes.title,
        popup: classes.popup,
        confirmButton: classes.actions,
        cancelButton: classes.actions,
        container: classes.container,
      },
    });
};
