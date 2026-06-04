import { FC, useReducer, useContext, createContext, Dispatch } from 'react';
import { TModalAction, IModalStore } from './types';
import { modalInitialState, modalsReducer } from './reducer';

const ModalDispatch = createContext<Dispatch<TModalAction>>(null as unknown as Dispatch<TModalAction>);
const ModalStore = createContext<IModalStore>(null as unknown as IModalStore);

export const ModalProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(modalsReducer, modalInitialState);

  return (
    <ModalStore.Provider value={state}>
      <ModalDispatch.Provider value={dispatch}>
        {children}
      </ModalDispatch.Provider>
    </ModalStore.Provider>
  );
};

export const useModalDispatch = () => {
  return useContext(ModalDispatch);
};

export const useModalStore = () => {
  return useContext(ModalStore);
};