import { useState } from 'react';

export const useSidebarEffects = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return {
    mobileOpen,
    handleDrawerToggle,
  };
};
