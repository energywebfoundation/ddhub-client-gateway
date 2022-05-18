import React, { createContext, useContext, useState, useMemo } from 'react';

type TState = {
  open: boolean;
};

const defaultState = {
  open: false,
};
const BackdropContext = createContext<TState>(defaultState);

export const BackdropContextProvider: React.FC = ({ children }) => {
  const [open, setOpen] = useState(defaultState.open);

  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <BackdropContext.Provider value={value}>
      {children}
    </BackdropContext.Provider>
  );
};

export const useBackdropContext = () => {
  return useContext(BackdropContext);
};
