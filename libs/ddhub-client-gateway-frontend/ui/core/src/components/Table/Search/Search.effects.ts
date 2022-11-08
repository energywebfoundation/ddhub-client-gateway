import { useEffect, useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import { useForm, FieldValues } from 'react-hook-form';
import { SearchProps } from './Search';

export const useSearchEffects = ({
  setFilter,
  filter,
  debounceTime = 300,
  onSearchInput,
  tableRows = [],
}: SearchProps) => {
  const [searchKey, setSearchKey] = useState('');

  const onFilterChange = useAsyncDebounce((value: string) => {
    setSearchKey(value);
    if (setFilter) {
      setFilter(value || '');
    } else if (onSearchInput) {
      onSearchInput(value || '');
    }
  }, debounceTime);

  useEffect(() => {
    if (searchKey && setFilter) {
      handleReset();
    }
  }, [tableRows]);

  const { register, reset, watch } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: { search: filter },
  });

  const field = {
    name: 'search',
    inputProps: {
      placeholder: 'Search',
    },
  };

  const inputProps = register(field.name);
  const value = watch(field.name);

  const handleReset = () => {
    onFilterChange('');
    reset({ search: '' });
  };

  return {
    field,
    handleReset,
    onFilterChange,
    inputProps,
    value,
  };
};
