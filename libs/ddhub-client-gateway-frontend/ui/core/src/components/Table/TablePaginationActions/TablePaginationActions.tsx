import IconButton from '@mui/material/IconButton';
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';
import { theme } from '@ddhub-client-gateway-frontend/ui/utils';
import React from 'react';

const useStyles = makeStyles()((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
  disabled: {
    fill: theme.palette.grey[500],
  },
  active: {
    fill: theme.palette.grey[200],
  },
}));

export interface TablePaginationActionsProps {
  count: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  page: number;
  rowsPerPage: number;
}

export const TablePaginationActions = (props: TablePaginationActionsProps) => {
  const { classes } = useStyles();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement> | null
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement> | null
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement> | null
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement> | null
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  const isFirstPage = page === 0;

  const isLastPage = page >= Math.ceil(count / rowsPerPage) - 1;

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={isFirstPage}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? (
          <LastPage className={isFirstPage ? classes.disabled : classes.active}/>
        ) : (
          <FirstPage className={isFirstPage ? classes.disabled : classes.active}/>
        )}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight className={isFirstPage ? classes.disabled : classes.active}/>
        ) : (
          <KeyboardArrowLeft className={isFirstPage ? classes.disabled : classes.active}/>
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={isLastPage}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft className={isLastPage ? classes.disabled : classes.active}/>
        ) : (
          <KeyboardArrowRight className={isLastPage ? classes.disabled : classes.active}/>
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={isLastPage}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? (
          <FirstPage className={isLastPage ? classes.disabled : classes.active}/>
        ) : (
          <LastPage className={isLastPage ? classes.disabled : classes.active}/>
        )}
      </IconButton>
    </div>
  );
};
