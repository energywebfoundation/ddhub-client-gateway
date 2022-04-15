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
  Box,
} from '@mui/material';
import { Search } from './Search';
import { TablePaginationActions } from './TablePaginationActions';
import { EmptyRow } from './EmptyRow/EmptyRow';
import { EmptyTable } from './EmptyTable/EmptyTable';
import { useTableEffects } from './Table.effects';
import { useStyles } from './Table.styles';
import { TTable } from './Table.types';

export const GenericTable: TTable = ({
  headers,
  tableRows,
  onRowClick,
  children,
}) => {
  const { classes } = useStyles();
  const {
    getTableProps,
    prepareRow,
    rows,
    gotoPage,
    setGlobalFilter,
    pageIndex,
    pageSize,
    globalFilter,
    totalLength,
    emptyRows,
  } = useTableEffects({ headers, tableRows });

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    gotoPage(newPage);
  };

  const handleRowClick = (selectedRow: any) => {
    if (!onRowClick) {
      return;
    }
    onRowClick(selectedRow);
  };

  return (
    <>
      <Box display="flex">
        <Search filter={globalFilter} setFilter={setGlobalFilter} />
        {children}
      </Box>
      <TableContainer component={Paper}>
        {rows.length !== 0 ? (
          <Table sx={{ minWidth: 500 }} {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((column) => (
                  <TableCell
                    style={{
                      width: column.width ?? 'initial',
                      color: column.hideHeader ? 'transparent' : 'inherit',
                    }}
                    classes={{ head: classes.head }}
                    key={column.accessor}
                  >
                    {column.Header}
                    <span>
                      {column?.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(pageSize > 0
                ? rows.slice(
                    pageIndex * pageSize,
                    pageIndex * pageSize + pageSize
                  )
                : rows
              ).map((row) => {
                prepareRow(row);
                return (
                  <TableRow
                    key={row.namespace}
                    {...row.getRowProps()}
                    onClick={() => handleRowClick(row)}
                  >
                    {row.cells.map((cell, key) => {
                      console.log(cell);
                      return (
                        <TableCell
                          key={key}
                          classes={{ body: classes.body }}
                          style={{
                            color: cell.column?.cellBodyColor || 'inherit',
                          }}
                          {...cell.getCellProps()}
                        >
                          {cell.render('Cell')}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}

              {emptyRows > 0 && <EmptyRow rowsToFill={emptyRows} />}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[]}
                  labelDisplayedRows={({ from, to, count }) =>
                    `Showing ${from} to ${to} of ${count} entries`
                  }
                  count={totalLength}
                  rowsPerPage={pageSize}
                  page={pageIndex}
                  onPageChange={handleChangePage}
                  ActionsComponent={TablePaginationActions}
                  classes={{
                    spacer: classes.spacer,
                    displayedRows: classes.displayedRows,
                  }}
                />
              </TableRow>
            </TableFooter>
          </Table>
        ) : (
          <EmptyTable />
        )}
      </TableContainer>
    </>
  );
};
