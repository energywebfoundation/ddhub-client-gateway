import { useState } from 'react';

export const useRestrictionsEffects = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpening = () => {
    setIsOpen(!isOpen);
  };

  return { isOpen, handleOpening };
};
