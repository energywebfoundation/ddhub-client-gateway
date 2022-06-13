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
      title: 'Are you sure?',
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

  const httpError = async (
    error: any
  ): Promise<SweetAlertResult> => {
    return await CustomSwal({
      title: 'Error',
      type: 'error',
      confirmButtonText: 'Dismiss',
      html:
        `${error?.response?.data?.err?.reason} <br /> ${error?.response?.data?.err?.additionalData ?? ''}`,
    }).fire();
  };
  return {
    fire,
    error,
    warning,
    success,
    httpError
  };
};
