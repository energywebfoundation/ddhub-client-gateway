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
  TableSortLabel,
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
import { visuallyHidden } from '@mui/utils';

export function GenericTable<T>({
  headers,
  tableRows,
  onRowClick,
  children,
  actions,
  loading,
  containerProps,
  loadingRows,
  showSearch = true,
  showFooter = true,
  paginationProps,
  onPageChange,
  onSearchInput,
  defaultOrder,
  defaultSortBy,
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
    emptyRows,
    handleChangePage,
    handleRowClick,
    handleRequestSort,
    order,
    orderBy,
    getComparator,
    pagination,
    handleSearchInput,
  } = useTableEffects({
    headers,
    tableRows,
    onRowClick,
    onPageChange,
    paginationProps,
    onSearchInput,
    defaultOrder,
    defaultSortBy,
  });

  return (
    <>
      {showSearch ? (
        <Box display="flex">
          <Search filter={globalFilter} onSearchInput={handleSearchInput} debounceTime={500} />
          {children}
        </Box>
      ) : (
        ''
      )}
      <TableContainer component={Paper} {...containerProps}>
        {loading ? (
          <TableRowsLoadingComponent pageSize={loadingRows ?? pageSize} />
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
                    style={{ ...column?.style }}
                    classes={{ head: classes.head }}
                    key={column?.accessor}
                    sortDirection={orderBy === column.accessor ? order : false}
                  >
                    {column.isSortable ? (
                      <TableSortLabel
                        active={orderBy === column.accessor}
                        direction={orderBy === column.accessor ? order : 'asc'}
                        onClick={(event) =>
                          handleRequestSort(event, column.accessor)
                        }
                      >
                        {column.Header}
                        {orderBy === column.accessor ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc'
                              ? 'sorted descending'
                              : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    ) : (
                      <>{column.Header}</>
                    )}
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
                ? rows
                    .sort(getComparator(order, orderBy))
                    .slice(
                      pageIndex * pageSize,
                      pageIndex * pageSize + pageSize
                    )
                : rows.sort(getComparator(order, orderBy))
              ).map((row) => {
                const data = row.original as any;
                prepareRow(row);
                return (
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => handleRowClick(data)}
                  >
                    {row.cells.map((cell) => {
                      const column = cell.column as ColumnInstance & {
                        color: string;
                      };
                      return (
                        <TableCell
                          style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                          classes={{ body: classes.body }}
                          color={column.color}
                          {...cell.getCellProps()}
                        >
                          {cell.render('Cell')}
                        </TableCell>
                      );
                    })}
                    {actions && (
                      <TableComponentActions<T> data={data} actions={actions} />
                    )}
                  </TableRow>
                );
              })}

              {emptyRows > 0 && <EmptyRow rowsToFill={emptyRows} />}
            </TableBody>
            {showFooter && (
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[]}
                    labelDisplayedRows={({ from, to, count }) =>
                      `Showing ${from} to ${to} of ${count} entries`
                    }
                    count={pagination.count}
                    rowsPerPage={pagination.limit}
                    page={pagination.page}
                    onPageChange={handleChangePage}
                    ActionsComponent={TablePaginationActions}
                    classes={{
                      spacer: classes.spacer,
                      displayedRows: classes.displayedRows,
                      toolbar: classes.toolbar,
                    }}
                  />
                </TableRow>
              </TableFooter>
            )}
          </Table>
        ) : (
          <EmptyTable />
        )}
      </TableContainer>
    </>
  );
}
