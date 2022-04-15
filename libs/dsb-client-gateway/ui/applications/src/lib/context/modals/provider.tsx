import React, { createContext, useContext, useReducer } from 'react';
import { applicationsModalsInitialState, applicationsModalsReducer } from './reducer';
import { IApplicationsModalsStore, TApplicationsModalsAction } from './types';

const ApplicationsModalsStore = createContext<IApplicationsModalsStore>(null);
const ApplicationsModalsDispatch =
  createContext<React.Dispatch<TApplicationsModalsAction>>(null);

export const ApplicationsModalsProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(
    applicationsModalsReducer,
    applicationsModalsInitialState
  );

  return (
    <ApplicationsModalsStore.Provider value={state}>
      <ApplicationsModalsDispatch.Provider value={dispatch}>
        {children}
      </ApplicationsModalsDispatch.Provider>
    </ApplicationsModalsStore.Provider>
  );
};

export const useApplicationsModalsStore = () => {
  return useContext(ApplicationsModalsStore);
};

export const useApplicationsModalsDispatch = () => {
  return useContext(ApplicationsModalsDispatch);
};
