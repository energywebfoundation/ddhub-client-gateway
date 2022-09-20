import { MouseEvent } from 'react';

export const useRestrictionListViewEffects = (remove?: (value: string) => void) => {
  const handleDelete = (event: MouseEvent<HTMLElement>, el: string) => {
    event.stopPropagation();

    if (remove) {
      remove(el);
    }
  };

  return { handleDelete }
};
