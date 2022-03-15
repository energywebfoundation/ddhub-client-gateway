import { alpha, InputBase, Theme, withStyles } from '@material-ui/core'
export const CustomInput = withStyles((theme: Theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3)
    }
  },
  input: {
    borderRadius: 5,
    position: 'relative',
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.background.paper}`,
    fontSize: 16,
    width: '100%',
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main
    }
  }
}))(InputBase)