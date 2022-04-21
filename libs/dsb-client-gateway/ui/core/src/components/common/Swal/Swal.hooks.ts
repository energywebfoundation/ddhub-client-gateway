import { Swal, SwalProps } from './Swal';

export const useCustomAlert = () => {
  const CustomSwal = Swal();
  const fire = async (props: SwalProps) => {
    return await CustomSwal(props).fire();
  };

  const error = async (props: Partial<SwalProps>) => {
    return await CustomSwal({
      title: 'Error',
      type: 'error',
      confirmButtonText: 'Dismiss',
      ...props,
    }).fire();
  };

  return {
    fire,
    error
  };
};
