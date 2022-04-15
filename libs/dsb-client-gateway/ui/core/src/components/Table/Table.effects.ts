import React from 'react';
import { fuzzyTextFilterFn } from './filters/fuzzy-text-filter';
import { textFilter } from './filters/text-filter';
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import { TableProps } from './Table.types';

export function useTableEffects<T>({ tableRows, headers }: TableProps<T>) {
  const data = React.useMemo(() => tableRows, [tableRows]);
  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: textFilter,
    }),
    []
  );
  const columns = React.useMemo(() => headers, []);
  const totalLength = data?.length || 0;

  const {
    getTableProps,
    prepareRow,
    rows,
    gotoPage,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      filterTypes,
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 6 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const emptyRows: number =
    pageIndex > 0 ? Math.max(0, (1 + pageIndex) * pageSize - rows.length) : 0;

  return {
    getTableProps,
    prepareRow,
    rows,
    gotoPage,
    setGlobalFilter,
    pageIndex,
    pageSize,
    globalFilter,
    totalLength,
    emptyRows,
  };
}
