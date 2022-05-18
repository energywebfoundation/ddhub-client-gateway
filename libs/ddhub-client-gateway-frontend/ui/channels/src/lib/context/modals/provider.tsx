import React, { createContext, useContext, useReducer } from 'react';
import { modalInitialState, modalsReducer } from './reducer';
import { IModalStore, TModalAction } from './types';

const ModalStore = createContext<IModalStore>(null);
const ModalDispatch = createContext<React.Dispatch<TModalAction>>(null);

export const ModalProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(modalsReducer, modalInitialState);

  return (
    <ModalStore.Provider value={state}>
      <ModalDispatch.Provider value={dispatch}>
        {children}
      </ModalDispatch.Provider>
    </ModalStore.Provider>
  );
};

export const useModalStore = () => {
  return useContext(ModalStore);
};

export const useModalDispatch = () => {
  return useContext(ModalDispatch);
};
