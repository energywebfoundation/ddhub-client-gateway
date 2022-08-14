import React, { useState } from 'react';
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

export type Order = 'asc' | 'desc';

interface LabelRowProps {
  from: number;
  to: number;
  count: number;
}

export function useTableEffects<T>({
  tableRows,
  headers,
  onRowClick,
  paginationProps,
  onPageChange,
  onSearchInput,
  defaultOrder = 'asc',
  defaultSortBy = '',
  backendSearch = false,
}: TableProps<T>) {
  const [order, setOrder] = useState<Order>(defaultOrder);
  const [orderBy, setOrderBy] = useState(defaultSortBy);
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
      initialState: { pageIndex: 0, pageSize: 10 },
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
    if (paginationProps && onPageChange) {
      // page starts at 0 index
      onPageChange(newPage + 1);
    } else {
      gotoPage(newPage);
    }
  };

  const handleRowClick = (selectedRow: T) => {
    if (!onRowClick) {
      return;
    }
    onRowClick(selectedRow);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchInput = (searchInput: string) => {
    if (!onSearchInput) {
      return;
    }

    onSearchInput(searchInput);
  };

  function descendingComparator(
    a: Record<string, string>,
    b: Record<string, string>,
    orderBy: string
  ) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(
    order: Order,
    orderBy: string
  ): (
    a: { values: Record<string, string> },
    b: { values: Record<string, string> }
  ) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a.values, b.values, orderBy)
      : (a, b) => -descendingComparator(a.values, b.values, orderBy);
  }

  const pagination = paginationProps
    ? {
        count: paginationProps.count,
        limit: paginationProps.limit,
        page: paginationProps.page - 1,
      }
    : {
        count: totalLength,
        limit: pageSize,
        page: pageIndex,
      };

  const paginationText = (props: LabelRowProps) => {
    if (backendSearch) {
      return `Showing ${props.from} to ${props.to} of ${props.count} entries`;
    }

    return `Showing ${props.from} to ${(rows.length < props.to ? rows.length : props.to)} of ${rows.length} entries`
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
    handleRequestSort,
    order,
    orderBy,
    getComparator,
    pagination,
    handleSearchInput,
    paginationText,
  };
}
