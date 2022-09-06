import React, { useState } from 'react';

export const useRestrictionsEffects = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpening = (event: React.MouseEvent<HTMLElement>) => {
    setIsOpen(!isOpen);
    event.stopPropagation();
  };

  return { isOpen, handleOpening };
};
