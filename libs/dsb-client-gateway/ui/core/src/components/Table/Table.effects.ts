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

export function useTableEffects<T>({
  tableRows,
  headers,
  onRowClick,
}: TableProps<T>) {
  const data = React.useMemo(
    () => tableRows,
    [tableRows]
  ) as unknown as readonly object[];
  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: textFilter,
    }),
    []
  );
  const columns = React.useMemo(() => headers, []);
  const totalLength = data.length;

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

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    gotoPage(newPage);
  };

  const handleRowClick = (selectedRow: T) => {
    if (!onRowClick) {
      return;
    }
    onRowClick(selectedRow);
  };

  return {
    getTableProps,
    prepareRow,
    rows,
    setGlobalFilter,
    pageIndex,
    pageSize,
    globalFilter,
    totalLength,
    emptyRows,
    handleChangePage,
    handleRowClick,
  };
}
