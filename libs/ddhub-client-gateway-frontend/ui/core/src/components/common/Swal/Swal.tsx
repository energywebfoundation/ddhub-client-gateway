import { ReactElement } from 'react';
import Sweetalert, { SweetAlertIcon } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  AlertCircle,
  Check,
  Info,
  HelpCircle,
  XCircle,
  Loader,
} from 'react-feather';
import { useStyles } from './Swal.styles';

const SwalCustom = withReactContent(Sweetalert);

export interface SwalProps {
  title: string;
  type: SweetAlertIcon;
  text?: string;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  width?: string;
  html?: string | HTMLElement;
}

export const Swal = () => {
  const { classes, theme } = useStyles();

  const icons: Record<SweetAlertIcon, ReactElement> = {
    warning: <AlertCircle style={{ stroke: theme.palette.warning.main }} />,
    success: <Check className={classes.successIcon} />,
    error: <XCircle style={{ stroke: theme.palette.error.main }} />,
    question: <HelpCircle />,
    info: <Info />,
    pending: <Loader />,
  };

  return ({
    title,
    type,
    text,
    showCancelButton,
    confirmButtonText,
    cancelButtonText,
    width,
    html,
  }: SwalProps) =>
    SwalCustom.mixin({
      title,
      iconHtml: icons[type],
      text,
      showCancelButton,
      confirmButtonText: confirmButtonText ?? 'Confirm',
      cancelButtonText: cancelButtonText ?? 'Cancel',
      width: width ?? '512px',
      html,
      customClass: {
        icon: classes.icon,
        title: classes.title,
        popup: classes.popup,
        confirmButton: classes.actions,
        cancelButton: classes.actions,
        container: classes.container,
        actions: classes.actionsContainer,
      },
    });
};
