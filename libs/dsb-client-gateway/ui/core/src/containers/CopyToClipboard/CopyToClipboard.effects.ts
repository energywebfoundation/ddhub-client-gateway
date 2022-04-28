import { useState } from 'react';

export const useCopyToClipboardEffects = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleOnTooltipClose = () => {
    setShowTooltip(false);
  };

  const onCopy = () => {
    setShowTooltip(true);
  };

  return {
    handleOnTooltipClose,
    onCopy,
    showTooltip,
  };
};
