import { Swal, SwalProps } from './Swal';

export const useCustomAlert = () => {
  const CustomSwal = Swal();
  const fire = async (props: SwalProps) => {
    return await CustomSwal(props).fire();
  };

  return {
    fire,
  };
};
