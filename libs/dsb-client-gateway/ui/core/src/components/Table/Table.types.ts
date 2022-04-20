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
  actions?: TTableComponentAction[];
  children?: ReactElement;
  showSearch?: boolean;
}
