import { Swal, SwalProps } from './Swal';
import { SweetAlertResult } from 'sweetalert2';

export const useCustomAlert = () => {
  const CustomSwal = Swal();
  const fire = async (props: SwalProps): Promise<SweetAlertResult> => {
    return await CustomSwal(props).fire();
  };

  const error = async (
    props: Partial<SwalProps>
  ): Promise<SweetAlertResult> => {
    return await CustomSwal({
      title: 'Error',
      type: 'error',
      confirmButtonText: 'Dismiss',
      ...props,
    }).fire();
  };

  const warning = async (
    props: Partial<SwalProps>
  ): Promise<SweetAlertResult> => {
    return await CustomSwal({
      title: 'Are you sure you want to proceed?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      ...props,
    }).fire();
  };

  const success = async (
    props: Partial<SwalProps>
  ): Promise<SweetAlertResult> => {
    return await CustomSwal({
      title: 'Success',
      type: 'success',
      confirmButtonText: 'Dismiss',
      ...props,
    }).fire();
  };

  const httpError = async (error: any): Promise<SweetAlertResult> => {
    let title = 'System Error';
    let subtitle = 'Please try again later.';
    const errData = error?.response?.data?.err;

    if (errData) {
      if (errData.reason) {
        title = errData.reason;
      }

      if (errData.additionalDetails?.errors?.[0]) {
        subtitle = errData.additionalDetails.errors[0];
      }
    }

    return await CustomSwal({
      title: 'Error',
      type: 'error',
      confirmButtonText: 'Dismiss',
      html: `${title} <br /> ${subtitle}`,
    }).fire();
  };

  return {
    fire,
    error,
    warning,
    success,
    httpError,
  };
};
