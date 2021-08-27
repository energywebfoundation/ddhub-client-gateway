import React, {useState} from 'react'
import Head from 'next/head'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { makeStyles } from '@material-ui/styles'
import {
  Typography,
	Button,
	Theme,
	Grid,
	MenuItem,
	FormControl,
	Select
} from '@material-ui/core'
import { Info } from '@material-ui/icons'
import { CustomInput } from '../../components/CustomInput/CustomInput'
import { Channel } from '../../utils'


export const Download = () => {
  const classes = useStyles()
	const [channelName, setChannelName] = useState('')
	const [channels, setChannels] = useState<Channel[]>([
		{
			fqcn: 'testK.channels.dsb.apps.energyweb.iam.ewc',
			createdBy: 'did:ethr:0xfd6b809B81cAEbc3EAB0d33f0211E5934621b2D2',
			createdDateTime: '2021-08-26T09:23:08.291Z',
			admins: [
				'did:ethr:0xfd6b809B81cAEbc3EAB0d33f0211E5934621b2D2'
			]
		}
	])

	return (
		<section className={classes.download}>
			<div className={classes.downloadHeader}>
					<Info />
			</div>

			<div className={classes.form}>
				<Grid container>
					<Grid item xs={12} sm={7} md={9}>
						<div className={classes.formGroup}>
							<Typography variant="caption">CHANNEL NAME</Typography>
							<FormControl>
								<Select
									labelId="channelLabel"
									id="demo-customized-select"
									value={channelName}
									onChange={(event: any) => setChannelName(event.target.value)}
									input={<CustomInput/>}
									fullWidth
								>
									{channels.map(channel => (
										<MenuItem key={channel.fqcn} value={channel.fqcn}>
											{channel.fqcn}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</div>
					</Grid>

					<Grid container spacing={2}>
						<Grid item xs={6} sm={5}>
							<Button
								variant="outlined"
								color="secondary"
								fullWidth
							>
								Download recent
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</div>

		</section>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  download: {
    border: '1px solid #fff',
	padding: theme.spacing(6),
	margin: theme.spacing(3, 1)
  },
	downloadHeader: {
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
	}
}))
