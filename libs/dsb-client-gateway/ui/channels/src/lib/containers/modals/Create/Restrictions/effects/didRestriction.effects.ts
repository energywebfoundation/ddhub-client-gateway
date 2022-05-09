import { useState } from 'react';

const didRegex = new RegExp(/^did:[a-z0-9]+:([a-z0-9]+:)?(0x[0-9a-fA-F]{40})$/);

export const useDIDRestrictionEffects = (currentDids: string[]) => {
  const [dids, setDids] = useState<string[]>(currentDids || []);
  const [didInput, setDIDInput] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true)

  const clearDIDInput = () => {
    setDIDInput('');
    setIsValid(true);
  };

  const didInputChangeHandler = (value: string) => {
    setDIDInput(value);
    setIsValid(didRegex.test(value));
  };

  const addDID = (did: string) => {
    if (dids.includes(did)) {
      return;
    }
    setDids([...dids, did]);
    clearDIDInput();
  };

  const removeDID = (value: string) => {
    setDids(dids.filter((did) => did !== value));
  };

  return {
    dids,
    didInput,
    isValid,
    clearDIDInput,
    setDIDInput,
    setDids,
    addDID,
    removeDID,
    didInputChangeHandler,
  };
};
