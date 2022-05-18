import React, {createContext, useContext, useState} from 'react';
import {BackdropProps} from "@dsb-client-gateway/ui/core";

const defaultState = {
  open: false,
};
const BackdropContext = createContext<BackdropProps>(defaultState);

export const BackdropContextProvider: React.FC = ({ children }) => {
  const [open, setOpen] = useState(defaultState.open);
  const setLoader = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  return (
    <BackdropContext.Provider value={{
      open,
      setLoader,
    }}>
      {children}
    </BackdropContext.Provider>
  );
}

export const useBackdropContext = () => {
  return useContext(BackdropContext);
};
