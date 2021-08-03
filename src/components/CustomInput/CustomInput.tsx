import react from 'react'
import { alpha, InputBase, Theme, withStyles } from "@material-ui/core";

export const CustomInput = withStyles((theme: Theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.secondary.dark,
        border: `1px solid ${theme.palette.secondary.dark}`,
        fontSize: 16,
        width: 'auto',
        padding: '10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            boxShadow: `${alpha(theme.palette.secondary.dark, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.secondary.dark,
        },
    },
}))(InputBase);
