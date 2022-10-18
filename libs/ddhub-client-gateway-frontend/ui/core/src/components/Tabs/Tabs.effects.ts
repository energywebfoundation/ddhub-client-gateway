import { useState, SyntheticEvent } from 'react';

export const useTabsEffects = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  return {
    value,
    handleChange,
    a11yProps,
  };
};
