import React, { createContext, useContext, useReducer } from 'react';
import { topicsModalsInitialState, topicsModalsReducer } from './reducer';
import { ITopicsModalsStore, TTopicsModalsAction } from './types';

const TopicsModalsStore = createContext<ITopicsModalsStore>(null);
const TopicsModalsDispatch =
  createContext<React.Dispatch<TTopicsModalsAction>>(null);

export const TopicsModalsProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(
    topicsModalsReducer,
    topicsModalsInitialState,
  );

  return (
    <TopicsModalsStore.Provider value={state}>
      <TopicsModalsDispatch.Provider value={dispatch}>
        {children}
      </TopicsModalsDispatch.Provider>
    </TopicsModalsStore.Provider>
  );
};

export const useTopicsModalsStore = () => {
  return useContext(TopicsModalsStore);
};

export const useTopicsModalsDispatch = () => {
  return useContext(TopicsModalsDispatch);
};
