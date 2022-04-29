import { ReactElement } from 'react';
import { TableCellProps, TableContainerProps } from '@mui/material';
import { TTableComponentAction } from '../Table/TableComponentActions';

export interface TableHeader {
  accessor: string;
  Header?: string;
  filter?: string;
  isSorted?: boolean;
  isSortedDesc?: boolean;
  width?: TableCellProps['width'];
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
}
