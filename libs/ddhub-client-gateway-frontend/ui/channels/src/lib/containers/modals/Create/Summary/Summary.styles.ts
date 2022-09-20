import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  detailsTitle: {
    fontSize: 12,
    lineHeight: '21px',
    fontWeight: 400,
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.grey[300],
    marginRight: 26,
  },
  description: {
    color: theme.palette.common.white,
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    fontFamily: theme.typography.body2.fontFamily,
  },
  divider: {
    marginTop: '21px',
  },
  label: {
    fontSize: 12,
    lineHeight: '14px',
    fontWeight: 400,
    fontFamily: theme.typography.body2.fontFamily,
    color: theme.palette.grey[300],
    marginBottom: 16,
  },
  mainLabel: {
    fontSize: 18,
    lineHeight: '21px',
    fontWeight: 500,
    color: theme.palette.common.white,
    fontFamily: theme.typography.body1.fontFamily,
  },
  encryptionValue: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    color: theme.palette.common.white,
  },
  iconCheck: {
    stroke: theme.palette.success.main,
    width: 21,
    height: 21,
  },
  tabRoot: {
    '& .MuiBox-root:nth-of-type(even)': {
      background: '#32394F',
      '& .MuiBox-root': {
        background: '#494A75',
      },
    },
  },
  tabBox: {
    maxHeight: '200px',
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
  },
  restrictionBox: {
    border: `1px solid #404656`,
    borderRadius: 6,
    padding: 6,
    marginBottom: 5,
  },
}));
