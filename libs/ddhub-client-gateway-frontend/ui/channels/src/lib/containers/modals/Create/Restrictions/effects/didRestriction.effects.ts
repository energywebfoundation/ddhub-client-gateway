import { useState, useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import { RestrictionType } from '../models/restriction-type.enum';

const didRegex = new RegExp(/^did:[a-z0-9]+:([a-z0-9]+:)?(0x[0-9a-fA-F]{40})$/);

export const useDIDRestrictionEffects = (currentDids: string[]) => {
  const [dids, setDids] = useState<string[]>(currentDids);
  const [didInput, setDIDInput] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);

  const debouncedInput = useRef(
    debounce( (value) => {
      if (value) {
        setIsValid(didRegex.test(value));
      } else {
        setIsValid(true);
      }
    }, 300)
  ).current;

  useEffect(() => {
    return () => {
      debouncedInput.cancel();
    };
  }, [debouncedInput]);

  const clearDIDInput = () => {
    setDIDInput('');
    setIsValid(true);
  };

  const didInputChangeHandler = (value: string) => {
    setDIDInput(value);
    debouncedInput(value);
  };

  const addDID = (did: string) => {
    if (!dids.includes(did)) {
      setDids([did, ...dids]);
    }

    clearDIDInput();
  };

  const removeDID = (value: string) => {
    setDids(dids.filter((did) => did !== value));
  };

  const updateDID = (type: RestrictionType, oldValue: string, newValue: string) => {
    const filteredDids = dids.filter((did) => did !== oldValue);

    if (!filteredDids.includes(newValue)) {
      const didsToSet = [...filteredDids];

      if (type === RestrictionType.DID) {
        didsToSet.unshift(newValue);
      }
      setDids(didsToSet);
    }

    clearDIDInput();
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
    setIsValid,
    updateDID,
  };
};
