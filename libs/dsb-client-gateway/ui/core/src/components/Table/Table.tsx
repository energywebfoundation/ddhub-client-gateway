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
import { ColumnInstance } from 'react-table';
import { Search } from './Search';
import { TablePaginationActions } from './TablePaginationActions';
import { TableComponentActions } from './TableComponentActions';
import { TableRowsLoadingComponent } from './TableRowsLoadingComponent';
import { EmptyRow } from './EmptyRow/EmptyRow';
import { EmptyTable } from './EmptyTable/EmptyTable';
import { useTableEffects } from './Table.effects';
import { useStyles } from './Table.styles';
import { TableProps } from './Table.types';

export function GenericTable<T>({
  headers,
  tableRows,
  onRowClick,
  children,
  actions,
  loading,
}: TableProps<T>) {
  const { classes } = useStyles();
  const {
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
  } = useTableEffects({ headers, tableRows, onRowClick });

  return (
    <>
      <Box display="flex">
        <Search filter={globalFilter} setFilter={setGlobalFilter} />
        {children}
      </Box>
      <TableContainer component={Paper}>
        {loading ? (
          <TableRowsLoadingComponent pageSize={pageSize} />
        ) : rows.length !== 0 ? (
          <Table
            className={classes.root}
            sx={{ minWidth: 500 }}
            {...getTableProps()}
          >
            <TableHead>
              <TableRow>
                {headers.map((column) => (
                  <TableCell
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
                {actions && (
                  <TableCell
                    classes={{ head: classes.head }}
                    className={classes.action}
                  />
                )}
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
                const data = row.original as any;
                prepareRow(row);
                return (
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => handleRowClick(row)}
                  >
                    {row.cells.map((cell) => {
                      const column = cell.column as ColumnInstance & {
                        color: string;
                      };
                      return (
                        <TableCell
                          classes={{ body: classes.body }}
                          color={column.color}
                          {...cell.getCellProps()}
                        >
                          {cell.render('Cell')}
                        </TableCell>
                      );
                    })}
                    {actions && (
                      <TableComponentActions id={data?.id} actions={actions} />
                    )}
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
}
