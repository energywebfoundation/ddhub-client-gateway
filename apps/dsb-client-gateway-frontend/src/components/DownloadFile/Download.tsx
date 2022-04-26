import { useState } from 'react'
import { makeStyles } from 'tss-react/mui';
import { Typography, Button, Grid, MenuItem, FormControl, Select } from '@mui/material'
import { Info } from '@mui/icons-material'
import { CustomInput } from '../../components/CustomInput/CustomInput'
import { Channel } from '../../utils'
import Swal from 'sweetalert2'
type DownloadProps = {
  channels: Channel[] | undefined,
  onDownload: (fqcn: string, amount: number, clientId?: string) => void
}
export const Download = ({ channels, onDownload }: DownloadProps,) => {
  const { classes } = useStyles()
  const [channelName, setChannelName] = useState('')
  return (
    <section className={classes.download}>
      <div className={classes.downloadHeader}>
        <Info />
      </div>
      <div className={classes.form}>
        <Grid container>
          <Grid item xs={12} sm={7} md={9}>
            <div className={classes.formGroup}>
              <Typography variant="caption">Channel name</Typography>
              <FormControl>
                <Select
                  labelId="channelLabel"
                  id="demo-customized-select"
                  value={channelName}
                  onChange={(event: any) => setChannelName(event.target.value)}
                  input={<CustomInput />}
                  fullWidth
                >
                  {channels?.map((channel) => (
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
              <Button variant="contained" color="primary" fullWidth
                onClick={() => {
                  if (!channelName) {
                    return Swal.fire('Error', 'Please enter channel name', 'error')
                  }
                  onDownload(channelName, 1)
                }}
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

const useStyles = makeStyles()((theme) => ({
  download: {
    borderRadius: '6px',
    background: theme.palette.background.paper,
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
