import { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Typography, Button, Theme, Grid, MenuItem, FormControl, Select } from '@material-ui/core'
import { Info } from '@material-ui/icons'
import { CustomInput } from '../CustomInput/CustomInput'
import swal from 'sweetalert'
import { Channel, Topic } from '../../utils'
type UploadProps = {
  channels?: Channel[]
  onUpload: (file: File, channelName: string, topic: string) => void
}
export const Upload = ({ channels, onUpload }: UploadProps) => {
  const classes = useStyles()
  const [file, setFile] = useState<File>()
  const [fileName, setFileName] = useState('')
  const [topicName, setTopicName] = useState('')
  const [channelName, setChannelName] = useState('')
  const [topics, setTopics] = useState<Topic[]>()
  useEffect(() => {
    const channel = channels?.find((channel) => channel.fqcn == channelName)
    setTopicName('')
    setTopics(channel?.topics ?? [])
  }, [channelName, channels])
  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFileName(event.target.files[0].name)
      setFile(event.target.files[0])
      event.target.value = null
    }
  }
  return (
    <section className={classes.upload}>
      <div className={classes.uploadHeader}>
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

          <Grid item xs={12} sm={7} md={9}>
            <div className={classes.formGroup}>
              <Typography variant="caption">Topic name</Typography>
              <FormControl>
                <Select
                  labelId="channelLabel"
                  id="demo-customized-select"
                  value={topicName}
                  onChange={(event: any) => setTopicName(event.target.value)}
                  input={<CustomInput />}
                  fullWidth
                >
                  {topics?.map((topic) => (
                    <MenuItem key={topic.namespace} value={topic.namespace}>
                      {topic.namespace}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={7} md={9}>
              <div className={classes.formGroup}>
                <Typography variant="caption">File</Typography>
                <CustomInput placeholder={fileName ? fileName : 'No file chosen'} fullWidth disabled />
              </div>
            </Grid>
            <Grid item xs={12} sm={5} md={3}>
              <Button variant="contained" color="primary" fullWidth className={classes.fileButton} component="label">
                Browse
                <input type="file" hidden accept=".txt, .xml, .csv, .json" onClick={uploadToClient} />
              </Button>
            </Grid>
            <Grid item xs={6} sm={5}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => {
                  if (!channelName) {
                    return swal('Error', 'Please enter channel name', 'error')
                  }
                  if (!file) {
                    return swal('Error', 'No file uploaded', 'error')
                  }
                  onUpload(file, channelName, topicName)
                }}
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
    borderRadius: '6px',
    background: theme.palette.primary.dark,
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