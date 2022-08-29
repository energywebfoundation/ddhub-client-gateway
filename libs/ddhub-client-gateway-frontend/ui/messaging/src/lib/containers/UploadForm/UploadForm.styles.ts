import { makeStyles } from 'tss-react/mui';
import { alpha } from '@mui/material/styles';

export const useStyles = makeStyles()((theme) => ({
  wrapper: {
    border: '1px solid #384151',
    borderRadius: 5,
    minHeight: 189,
    padding: '21px 21px 26px 21px',
    background: '#283046',
    display: 'flex',
    flexDirection: 'column',
  },
  uploadWrapper: {
    border: '1px dashed #848484',
    padding: '65px 10px 55px 10px',
    background: '#20273D',
    borderRadius: 5,
  },
  uploadWrapperDisabled: {
    borderColor: '#676D7D',
    background: '#262D43',
    cursor: 'no-drop',
  },
  uploadWrapperHover: {
    '&:hover': {
      borderColor: theme.palette.primary.main,
      boxShadow: `2px 2px 12px ${alpha(theme.palette.primary.main, 0.27)}`,
      cursor: 'pointer',
    },
  },
  uploadedWrapperHover: {
    '&:hover': {
      background: '#262D43',
      cursor: 'pointer',
      '#replace-message': {
        display: 'block',
      },
      '#upload-message': {
        display: 'none',
      },
      '#fileUploadPartial': {
        fill: '#676D7D !important',
      },
    },
  },
  title: {
    fontSize: 16,
    lineHeight: '19.2px',
    fontWeight: 500,
    color: theme.palette.common.white,
  },
  titleDisabled: {
    color: '#676D7D',
  },
  label: {
    paddingTop: 4,
    fontSize: 12,
    lineHeight: '14.16px',
    fontWeight: 405,
    color: '#D0D2D6',
  },
}));
