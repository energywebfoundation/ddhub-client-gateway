import { useState } from 'react'
import { Button, makeStyles, Theme, Tooltip, Typography } from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import swal from 'sweetalert'
import { CustomInput } from '../CustomInput/CustomInput'
import { CertificateFiles } from '../../utils'
type ProxyCertificateProps = {
  certificate?: CertificateFiles
  isLoading: boolean
  onSubmit: (cert: File, key: File, ca?: File) => void
}
export const ProxyCertificate = ({
  certificate,
  isLoading,
  onSubmit
}: ProxyCertificateProps) => {
  const classes = useStyles()
  const [cert, setCert] = useState<File>()
  const [privateKey, setPrivateKey] = useState<File>()
  const [ca, setCa] = useState<File>()
  return (
    <div className={classes.credentials}>
      <div className={classes.formGroup}>
        <div className={classes.credentialsHeader}>
          <Typography variant="h6">Outbound Certificate</Typography>
          <Tooltip
            title="Configure the certificate (public and private key) used for mTLS authentication
            (if using a message broker inside a secure environment)."
          >
            <InfoIcon />
          </Tooltip>
        </div>

        <div>
          <div className={classes.formGroup}>
            <Typography className={classes.formLabel} variant="caption">Certificate</Typography>
            <div className={classes.fileInput}>
              <CustomInput placeholder={cert?.name ?? certificate?.cert.name ?? 'Upload a .pem file'} disabled />
              <Button
                variant="contained"
                color="primary"
                className={classes.fileButton}
                component="label"
              >
                Browse
                <input
                  type="file"
                  hidden
                  accept=".pem, .der, .cer, .crt"
                  onChange={(e) => setCert(e.target.files?.[0])}
                />
              </Button>
            </div>
          </div>
          <div className={classes.formGroup}>
            <Typography className={classes.formLabel} variant="caption">Private key</Typography>
            <div className={classes.fileInput}>
              <CustomInput placeholder={privateKey?.name ?? certificate?.key?.name ?? 'Upload a .pem file'} disabled />
              <Button
                variant="contained"
                color="primary"
                className={classes.fileButton}
                component="label"
              >
                Browse
                <input
                  type="file"
                  hidden
                  accept=".pem, .der, .key"
                  onChange={(e) => setPrivateKey(e.target.files?.[0])}
                />
              </Button>
            </div>
          </div>
          <div className={classes.formGroup}>
            <Typography className={classes.formLabel} variant="caption">CA Certificate (optional)</Typography>
            <div className={classes.fileInput}>
              <CustomInput placeholder={ca?.name ?? certificate?.ca?.name ?? 'Upload a .crt file'} disabled />
              <Button
                variant="contained"
                color="primary"
                className={classes.fileButton}
                component="label"
              >
                Browse
                <input
                  type="file"
                  hidden
                  accept=".pem, .ca-bundle, .crt, .der, .cer"
                  onChange={(e) => setCa(e.target.files?.[0])}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.buttonGroup}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
          onClick={() => {
            if (!cert || !privateKey) {
              return swal('Error', 'Public certificate and private key are required.')
            }
            onSubmit(cert, privateKey, ca)
          }}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  credentials: {
    borderRadius: '6px',
    background: theme.palette.primary.dark,
    padding: '2rem',
    minHeight: '550px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  credentialsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff',
    marginBottom: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginBottom: '2rem',
    '& span': {
      fontSize: '.8rem',
    },
    '& input': {
      color: '#fff',
      width: '230px'
    }
  },
  formLabel: {
    color: '#fff',
    marginBottom: '.3rem'
  },
  buttonGroup: {
    marginTop: '1rem',
    '& button': {
      padding: '.7rem',
      marginBottom: '1rem'
    }
  },
  fileInput: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  fileButton: {
    // marginTop: theme.spacing(3),
    // padding: '.7rem'
  }
}))
