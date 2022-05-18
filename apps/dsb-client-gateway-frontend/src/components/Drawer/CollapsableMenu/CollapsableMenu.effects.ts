import { useState } from 'react';

export const useCollapsableListItemEffects = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpening = () => {
    setIsOpen(!isOpen);
  };

  return { isOpen, handleOpening };
};
