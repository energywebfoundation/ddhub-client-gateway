import { FC } from 'react';
import { Certificate } from './Certificate';
import { Roles } from './Roles';

export const ModalCenter: FC = () => {
  return (
    <>
      <Roles />
      <Certificate />
    </>
  );
};
