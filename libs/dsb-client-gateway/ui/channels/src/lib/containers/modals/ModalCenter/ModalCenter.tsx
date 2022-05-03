import { FC } from 'react';
import { Create } from '../Create/Create';
import { Details } from './Details';

export const ModalCenter: FC = () => {
  return (
    <>
      <Create />
      <Details />
    </>
  );
};
