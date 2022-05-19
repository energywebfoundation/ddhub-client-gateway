import { FC, useReducer, useContext, createContext } from 'react';
import { TModalAction, IModalStore } from './types';
import { modalInitialState, modalsReducer } from './reducer';

const ModalDispatch = createContext<React.Dispatch<TModalAction>>(null);
const ModalStore = createContext<IModalStore>(null);

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
