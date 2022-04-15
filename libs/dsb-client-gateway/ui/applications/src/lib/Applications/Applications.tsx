import { FC } from 'react';
import { ApplicationsModalsProvider } from '../context';
import { ApplicationsModalsCenter } from '../modals';
import { Application } from '../Application';

export const Applications: FC = () => {
  return (
    <ApplicationsModalsProvider>
      <Application />
      <ApplicationsModalsCenter />
    </ApplicationsModalsProvider>
  );
};
