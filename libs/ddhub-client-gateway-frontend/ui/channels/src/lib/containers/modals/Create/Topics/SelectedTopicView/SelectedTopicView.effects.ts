import { useState } from 'react';

export const useSelectedTopicViewEffects = () => {
  const [expandResponse, setExpandResponse] = useState<boolean>(false);

  return {
    expandResponse,
    setExpandResponse,
  };
};
