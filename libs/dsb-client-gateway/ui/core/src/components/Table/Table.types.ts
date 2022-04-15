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
  onRowClick?: (data: T) => void;
}
