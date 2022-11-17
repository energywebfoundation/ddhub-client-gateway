import { ReactElement, ChangeEvent } from 'react';
import { TableCellProps, TableContainerProps } from '@mui/material';
import { TTableComponentAction } from '../Table/TableComponentActions';
import { FilterValue } from 'react-table';

export interface TableHeader {
  accessor: string;
  Header?: string;
  filter?: string;
  isSortable?: boolean;
  style?: TableCellProps['style'];
  Cell?: React.ReactNode,
  color?: string;
}

export interface TablePagination {
  limit: number;
  count: number;
  page: number;
}

export interface TableCustomStyle {
  tableMinWidth: string;
}

export interface TableProps<T> {
  headers: TableHeader[];
  tableRows: T[];
  onRowClick?: (data: T) => void;
  loading?: boolean;
  actions?: TTableComponentAction<T>[];
  children?: ReactElement;
  showSearch?: boolean;
  showFooter?: boolean;
  containerProps?: TableContainerProps;
  loadingRows?: number;
  paginationProps?: TablePagination;
  onPageChange?: (newPage: number, limit: number) => void;
  onSearchInput?: (filterValue: FilterValue, limit: number) => void;
  defaultSortBy?: string;
  defaultOrder?: 'asc' | 'desc';
  customStyle?: TableCustomStyle;
  backendSearch?: boolean;
  stripedTable?: boolean;
  showCheckbox?: boolean;
  setSelectedItems?: (values: string[]) => void;
  rowsPerPageOptions?: number[];
}
