import { useState } from 'react';

export const useCollapsableListItemEffects = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpening = (forceState?: boolean) => {
    setIsOpen(forceState !== undefined ? forceState : !isOpen);
  };

  return { isOpen, handleOpening };
};
