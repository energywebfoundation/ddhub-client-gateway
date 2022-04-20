import { ReactElement } from 'react';
import { Row } from 'react-table';
import { TTableComponentAction } from '../Table/TableComponentActions';

export interface TableHeader {
  accessor: string;
  Header: string;
  filter?: string;
  isSorted?: boolean;
  isSortedDesc?: boolean;
}

export interface TableProps<T> {
  headers: TableHeader[];
  tableRows: T[];
  onRowClick?: (data: Row<object>) => void;
  loading?: boolean;
  actions?: TTableComponentAction<T>[];
  children?: ReactElement;
  showSearch?: boolean;
}
