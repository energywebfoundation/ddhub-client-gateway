import IconButton from "@mui/material/IconButton"
import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';
import { theme } from '@dsb-client-gateway/ui/utils';
import React from 'react';

const useStyles = makeStyles()(theme => ({
  root: {
    '& svg': {
      fill: theme.palette.grey[400]
    },
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  }
}))


export interface TablePaginationActionsProps {
  count: number,
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void,
  page: number,
  rowsPerPage: number,
}

export const TablePaginationActions = (props: TablePaginationActionsProps) => {
  const {classes} = useStyles()
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement> | null) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement> | null) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement> | null) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement> | null) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPage/> : <FirstPage/>}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight/>
        ) : (
          <KeyboardArrowLeft/>
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft/>
        ) : (
          <KeyboardArrowRight/>
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPage/> : <LastPage/>}
      </IconButton>
    </div>
  );
}

