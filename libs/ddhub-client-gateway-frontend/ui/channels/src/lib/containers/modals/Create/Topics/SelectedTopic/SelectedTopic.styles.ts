import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material';
import { darken } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  name: {
    color: theme.palette.common.white,
    fontSize: 12,
    lineHeight: '18px',
  },
  icon: {
    top: 8,
    right: 13,
    stroke: alpha(theme.palette.grey[100], 0.5),
    width: 20,
    '&.Mui-disabled': {
      stroke: theme.palette.grey[500],
    },
  },
  select: {
    marginBottom: 9,
    borderRadius: 5,
    '&.MuiInputBase-root': {
      fontFamily: theme.typography.body2.fontFamily,
      fontSize: 12,
      lineHeight: '24px',
      fontWeight: 400,
      color: theme.palette.common.white,
      width: '100%',
      '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
        border: `1px solid ${theme.palette.grey[500]}`,
      },
    },
    '& .MuiSelect-select': {
      padding: '8px 11px 9px 6px !important',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: '1px solid #404656',
      borderRadius: 5,
    },
    '&:nth-of-type(even)': {
      background: '#32374A',
    },
  },
  recent: {
    '& .MuiTypography-root': {
      color: theme.palette.common.white,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: `1px solid ${theme.palette.common.white}`,
      borderRadius: 5,
    },
  },
  optionTitle: {
    fontSize: 12,
    lineHeight: '14px',
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.text.secondary,
    padding: '12px 18px 14px 18px',
    fontWeight: 405,
  },
  topic: {
    display: 'flex',
    padding: '8px 18px 14px 18px',
    borderBottom: '1px solid #404656',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      color: theme.palette.primary.main,
    },
    '&:hover .MuiTypography-root': {
      color: theme.palette.primary.main,
    },
  },
  cancelButton: {
    height: 37,
    minWidth: 87,
    textTransform: 'capitalize',
    padding: '10px 22px',
    justifyContent: 'center',
    border: `1px solid ${theme.palette.primary.main}`,
    margin: '0 16px 0 auto',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
      border: `1px solid ${theme.palette.primary.main}`,
    },
  },
  buttonText: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.primary.main,
    fontFamily: theme.typography.body2.fontFamily,
  },
  buttonTextSave: {
    fontSize: 14,
    lineHeight: '17px',
    fontWeight: 400,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
    transition: theme.transitions.create('color', {
      duration: theme.transitions.duration.short,
    }),
  },
  saveButton: {
    height: 37,
    minWidth: 95,
    textTransform: 'capitalize',
    padding: '11px 22px',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: darken(theme.palette.primary.main, 0.2),
      boxShadow: `0px 0px 10px ${alpha(theme.palette.primary.main, 0.65)}`,
    },
    '&.Mui-disabled': {
      '& .MuiButton-endIcon svg': {
        stroke: alpha(theme.palette.common.black, 0.26),
      },
      '& .MuiTypography-root': {
        color: alpha(theme.palette.common.black, 0.26),
      },
    },
  },
  selected: {
    border: `1px solid ${theme.palette.common.white}`,
    '& .MuiTypography-root': {
      color: theme.palette.common.white,
    },
  },
  noRecord: {
    background: alpha(theme.palette.info.main, 0.12),
    borderRadius: 4,
    marginTop: 9,
  },
  noRecordLabel: {
    fontFamily: theme.typography.body2.fontFamily,
    fontSize: 12,
    lineHeight: '21px',
    color: theme.palette.info.main,
    padding: '9px 14px 10px 14px',
  },
  label: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    color: theme.palette.common.white,
    fontFamily: theme.typography.body2.fontFamily,
  },
  topicBox: {
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: 2,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.background.paper,
      boxSizing: 'border-box',
      borderRadius: 3,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.primary.main,
      borderRadius: 3,
    },
    maxHeight: 380,
  },
  listHeader: {
    borderBottom: '1px solid #404656',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 12,
  },
  searchField: {
    margin: '0 0 0 16px',
    background: alpha(theme.palette.background.default, 0.45),
    borderRadius: 2,
    width: 211,
    '& .MuiInputBase-root': {
      fontFamily: theme.typography.body2.fontFamily,
      fontSize: 10,
      lineHeight: '12px',
      fontWeight: 405,
      paddingLeft: 8,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 5,
    },
    '& input': {
      padding: '6px 7px 7px 0px',
      fontSize: 10,
      color: theme.palette.common.white,
      minHeight: 22,
      fontFamily: theme.typography.body2.fontFamily,
      '&:disabled': {
        color: theme.palette.grey[500],
        WebkitTextFillColor: theme.palette.grey[500],
        '& + .MuiOutlinedInput-notchedOutline': {
          border: `1px solid ${theme.palette.grey[500]}`,
        },
      },
      '&::placeholder': {
        fontSize: 10,
        lineHeight: '12px',
        fontWeight: 405,
        color: theme.palette.grey[300],
        opacity: 1,
      },
    },
  },
  closeSearch: {
    color: theme.palette.common.white,
    cursor: 'pointer',
    width: 16,
    height: 16,
  },
  searchIcon: {
    color: theme.palette.common.white,
    width: 10,
    height: 10,
  },
}));
