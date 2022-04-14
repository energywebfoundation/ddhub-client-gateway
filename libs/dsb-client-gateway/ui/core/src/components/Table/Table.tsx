import React from 'react';
import 'regenerator-runtime/runtime';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { Search } from './Search';
import { TablePaginationActions } from './TablePaginationActions';
import { EmptyRow } from './EmptyRow/EmptyRow';
import { useTableEffects } from './Table.effects';
import { TableProps } from './Table.types';
import { EmptyTable } from './EmptyTable/EmptyTable';

export function GenericTable<T>({headers, tableRows, onRowClick}: TableProps<T>) {
  const {
    getTableProps,
    prepareRow,
    rows,
    gotoPage,
    setPageSize,
    setGlobalFilter,
    pageIndex, pageSize, globalFilter,
    totalLength,
    emptyRows
  } = useTableEffects({headers, tableRows});

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
  };

  const handleRowClick = (selectedRow: T) => {
    if (!onRowClick) {
      return;
    }
    onRowClick(selectedRow);
  };

  return (
    <>
      <Search
        filter={globalFilter}
        setFilter={setGlobalFilter}
      />
      <TableContainer component={Paper}>
        {rows.length !== 0 ? <Table sx={{minWidth: 500}} {...getTableProps()}>
          <TableHead>
            <TableRow>
              {headers.map((column) => (
                <TableCell
                  key={column.accessor}>
                  {column.Header}
                  <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(pageSize > 0
                ? rows.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
                : rows
            ).map((row) => {
              prepareRow(row);
              return (
                <TableRow key={row.namespace} {...row.getRowProps()} onClick={(event) => handleRowClick(event, row)}>
                  {row.cells.map((cell, key) => {
                    return (
                      <TableCell
                        key={key}
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}

            {emptyRows > 0 && (<EmptyRow rowsToFill={emptyRows}/>)}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[3, 10, 25, 100]}
                count={totalLength}
                rowsPerPage={pageSize}
                page={pageIndex}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table> : <EmptyTable />}

      </TableContainer>
    </>
  );
}

