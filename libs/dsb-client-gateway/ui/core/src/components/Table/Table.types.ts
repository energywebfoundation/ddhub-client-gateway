import { PropsWithChildren, ReactElement } from 'react';

export interface TableHeader {
  accessor: string;
  Header: string;
  filter?: string;
  isSorted?: boolean;
  isSortedDesc?: boolean;
  width?: number;
  hideHeader?: boolean;
}

export interface TableProps<T> {
  headers: TableHeader[];
  tableRows: T[];
  onRowClick?: (data: T) => void;
}

export type TTable = <T>(
  props: PropsWithChildren<TableProps<T>>
) => ReactElement;
