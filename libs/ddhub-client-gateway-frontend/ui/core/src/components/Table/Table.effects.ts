import React, { ChangeEvent, useMemo, useState } from 'react';
import { fuzzyTextFilterFn } from './filters/fuzzy-text-filter';
import { textFilter } from './filters/text-filter';
import {
  Column,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import { TableHeader, TableProps } from './Table.types';

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
  setSelectedItems,
  showCheckbox = false,
}: TableProps<T>) {
  const [order, setOrder] = useState<Order>(defaultOrder);
  const [orderBy, setOrderBy] = useState(defaultSortBy);
  const [selected, setSelected] = useState<string[]>([]);

  const data = useMemo(
    () => tableRows,
    [tableRows]
  ) as unknown as readonly object[];
  const filterTypes = useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: textFilter,
    }),
    []
  );
  const columns = useMemo(
    () => headers,
    [headers]
  ) as unknown as readonly Column<object>[];
  const totalLength = data.length;

  const {
    getTableProps,
    prepareRow,
    rows,
    gotoPage,
    setGlobalFilter,
    setPageSize,
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

  const resetCheckbox = () => {
    if (!showCheckbox) return;

    setSelected([]);

    if (setSelectedItems) {
      setSelectedItems([]);
    }
  };

  const emptyRows: number =
    pageIndex > 0 ? Math.max(0, (1 + pageIndex) * pageSize - rows.length) : 0;

  const changePage = (newPage: number, limit: number) => {
    resetCheckbox();
    if (paginationProps && onPageChange) {
      // page starts at 0 index
      onPageChange(newPage + 1, limit);
    } else {
      gotoPage(newPage);
    }
  };

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    changePage(newPage, pageSize);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const limit = parseInt(event.target.value, 10);
    setPageSize(limit);
    changePage(0, limit);
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

    onSearchInput(searchInput, pageSize);
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
        limit: paginationProps.limit === 0 ? paginationProps.limit : pageSize,
        page: paginationProps.page - 1,
      }
    : {
        count: totalLength,
        limit: pageSize,
        page: pageIndex,
      };

  const paginationText = (props: LabelRowProps) => {
    if (backendSearch) {
      return `Showing ${props.from} to ${props.to} of ${props.count}`;
    }

    return `Showing ${props.from} to ${
      rows.length < props.to ? rows.length : props.to
    } of ${rows.length}`;
  };

  const handleCheckboxClick = (
    event: React.MouseEvent<unknown>,
    name: string
  ) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex > -1) {
      const copy = [...selected];
      copy.splice(selectedIndex, 1);
      newSelected = copy;
    } else {
      newSelected = [...selected, name];
    }

    setSelected(newSelected);

    if (setSelectedItems) {
      setSelectedItems(newSelected);
    }
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    const newSelected: string[] = [];

    if (event.target.checked) {
      const startIdx = pageIndex * pageSize;
      const endIdx = startIdx + pageSize;

      for (let i = startIdx; i < endIdx; i++) {
        if (rows[i]) {
          newSelected.push(rows[i].cells[0].value);
        }
      }
    }

    setSelected(newSelected);

    if (setSelectedItems) {
      setSelectedItems(newSelected);
    }
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

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
    handleChangeRowsPerPage,
    isSelected,
    handleCheckboxClick,
    handleSelectAllClick,
    selected,
  };
}
