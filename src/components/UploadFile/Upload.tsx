import React from 'react';
import { makeStyles } from '@material-ui/styles'
import {
  Typography,
  Button,
  Theme,
  Grid,
} from '@material-ui/core';
import { Info } from '@material-ui/icons'
import { CustomInput } from '../../components/CustomInput/CustomInput';


export const Upload = () => {
  const classes = useStyles()

	return (
		<section className={classes.upload}>
			<div className={classes.uploadHeader}>
					<Info />
			</div>

			<div className={classes.form}>
				<Grid container>
					<Grid item xs={12} sm={7} md={9}>
						<div className={classes.formGroup}>
							<Typography variant="caption">CHANNEL NAME</Typography>
							<CustomInput
								placeholder='Fully Qualified Channel Name'
								fullWidth
							/>
						</div>
					</Grid>

					<Grid container spacing={2}>
						<Grid item xs={12} sm={7} md={9}>
							<div className={classes.formGroup}>
								<Typography variant="caption">FILE</Typography>
								<CustomInput
									placeholder='File'
									fullWidth
									disabled
								/>
							</div>
						</Grid>
						<Grid item xs={12} sm={5} md={3}>
							<Button
								variant="outlined"
								color="secondary"
								fullWidth
								className={classes.fileButton}
								component="label"
							>
								Browse
								<input
									type="file"
									hidden
								/>
							</Button>
						</Grid>
						<Grid item xs={6} sm={5}>
							<Button
								variant="outlined"
								color="secondary"
								fullWidth
							>
								Upload
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</div>

		</section>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  upload: {
    border: '1px solid #fff',
		padding: theme.spacing(6),
		margin: theme.spacing(3, 1)
  },
	uploadHeader: {
		textAlign: 'right',
		color: '#fff'
	},
	form: {
		marginTop: '1rem',

		'& button': {
			padding: '.7rem',
			marginBottom: '1rem'
		}
	},
	formGroup: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		marginBottom: '2rem',

		'& span': {
				fontSize: '.8rem',
				marginBottom: '.3rem'
		},
		'& *': {
				color: '#fff'
		},
		'& input': {
				width: '100%'
			}
	},
	errorText: {
		color: theme.palette.error.main
	},
	fileButton: {
		marginTop: theme.spacing(3),
		padding: '.5rem'
	}
}))
