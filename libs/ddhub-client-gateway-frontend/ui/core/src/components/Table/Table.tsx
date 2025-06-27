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
  Checkbox,
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
import clsx from 'clsx';

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
  backendSearch = false,
  stripedTable = false,
  paginationProps,
  onPageChange,
  customStyle,
  onSearchInput,
  defaultOrder,
  defaultSortBy,
  showCheckbox = false,
  setSelectedItems,
  rowsPerPageOptions = [10, 20, 50, 100],
  renderBanner,
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
    paginationText,
    handleChangeRowsPerPage,
    isSelected,
    handleCheckboxClick,
    handleSelectAllClick,
    selected,
  } = useTableEffects({
    headers,
    tableRows,
    onRowClick,
    onPageChange,
    paginationProps,
    onSearchInput,
    defaultOrder,
    defaultSortBy,
    backendSearch,
    setSelectedItems,
    showCheckbox,
  });

  const selectedTotal = selected.length;
  const currentPageRowsTotal = rows.length < pageSize ? rows.length : pageSize;

  return (
    <>
      {showSearch ? (
        <Box>
          <Box display="flex">
            {backendSearch ? (
              <Search
                filter={globalFilter}
                onSearchInput={handleSearchInput}
                debounceTime={500}
              />
            ) : (
              <Search
                filter={globalFilter}
                setFilter={setGlobalFilter}
                tableRows={tableRows}
              />
            )}
            {children}
          </Box>
        </Box>
      ) : (
        ''
      )}

      {renderBanner && renderBanner()}

      <TableContainer component={Paper} {...containerProps}>
        {loading ? (
          <TableRowsLoadingComponent pageSize={loadingRows ?? pageSize} />
        ) : rows.length !== 0 ? (
          <Table
            className={classes.root}
            sx={{ minWidth: customStyle?.tableMinWidth ?? 500 }}
            {...getTableProps()}
          >
            <TableHead>
              <TableRow>
                {showCheckbox && (
                  <TableCell
                    padding="checkbox"
                    classes={{ head: classes.head }}
                  >
                    <Checkbox
                      color="primary"
                      checked={
                        rows.length > 0 &&
                        selectedTotal === currentPageRowsTotal
                      }
                      onChange={handleSelectAllClick}
                      inputProps={{
                        'aria-label': 'select all',
                      }}
                    />
                  </TableCell>
                )}

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
              ).map((row, index) => {
                const firstCol = row.cells[0].value;
                const isItemSelected = showCheckbox
                  ? isSelected(firstCol)
                  : false;
                const labelId = `enhanced-table-checkbox-${index}`;

                const data = row.original as any;
                const showActions = Array.isArray(actions)
                  ? actions
                  : actions?.(data);
                prepareRow(row);
                return (
                  <TableRow
                    className={clsx({
                      [classes.stripedRow]: stripedTable,
                    })}
                    {...row.getRowProps()}
                    onClick={() => handleRowClick(data)}
                  >
                    {showCheckbox && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          onClick={(event) =>
                            handleCheckboxClick(event, firstCol)
                          }
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                    )}
                    {row.cells.map((cell) => {
                      const column = cell.column as ColumnInstance & {
                        color: string;
                      };
                      return (
                        <TableCell
                          style={{
                            cursor: onRowClick ? 'pointer' : 'default',
                            border: stripedTable ? 'none' : '',
                          }}
                          classes={{ body: classes.body }}
                          color={column.color}
                          {...cell.getCellProps()}
                        >
                          {cell.render('Cell')}
                        </TableCell>
                      );
                    })}
                    {showActions && (
                      <TableComponentActions<T>
                        data={data}
                        actions={showActions}
                      />
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
                    rowsPerPageOptions={rowsPerPageOptions}
                    labelDisplayedRows={paginationText}
                    count={pagination.count}
                    rowsPerPage={Number(pagination.limit)}
                    page={Number(pagination.page)}
                    onPageChange={handleChangePage}
                    ActionsComponent={TablePaginationActions}
                    classes={{
                      spacer: classes.spacer,
                      toolbar: classes.toolbar,
                      selectIcon: classes.selectIcon,
                      menuItem: classes.menuItem,
                    }}
                    onRowsPerPageChange={handleChangeRowsPerPage}
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
