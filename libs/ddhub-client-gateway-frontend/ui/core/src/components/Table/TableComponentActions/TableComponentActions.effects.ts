import { useState, useRef } from 'react';

export const useTableComponentActionsEffects = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setMenuOpen(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuOpen(true);
  };

  return {
    menuOpen,
    handleMenuOpen,
    handleClose,
    anchorRef,
  };
};
