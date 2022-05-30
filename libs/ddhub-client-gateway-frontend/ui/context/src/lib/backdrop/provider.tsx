import React, { createContext, useContext, useState, useMemo } from 'react';

type TState = {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};

const defaultState = {
  isLoading: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsLoading: (value: boolean) => {},
};
const BackdropContext = createContext<TState>(defaultState);

export const BackdropContextProvider: React.FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState(defaultState.isLoading);

  const value = useMemo(() => ({ isLoading, setIsLoading }), [isLoading]);
  return (
    <BackdropContext.Provider value={value}>
      {children}
    </BackdropContext.Provider>
  );
};

export const useBackdropContext = () => {
  return useContext(BackdropContext);
};
