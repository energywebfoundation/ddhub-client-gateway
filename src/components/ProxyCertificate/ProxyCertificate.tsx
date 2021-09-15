import { useState } from 'react'
import { Button, makeStyles, Theme, Typography } from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import { CustomInput } from '../../components/CustomInput/CustomInput'

type ProxyCertificateProps = {
  originalClientId: string
  originalTenantId: string
  isLoading: boolean
  onSubmit: (clientId: string, tenantId: string, clientSecret: string) => void
}

export const ProxyCertificate = ({
  originalClientId,
  originalTenantId,
  isLoading,
  onSubmit
}: ProxyCertificateProps) => {
  const classes = useStyles()

  const [clientId, setClientId] = useState(originalClientId)
  const [tenantId, setTenantId] = useState(originalTenantId)
  const [clientSecret, setClientSecret] = useState('')

  return (
    <div className={classes.credentials}>
      <div className={classes.formGroup}>
        <div className={classes.credentialsHeader}>
          <Typography variant="h6">OUTBOUND CERTIFICATE</Typography>
          <InfoIcon />
        </div>

        <div>
          <div className={classes.formGroup}>
            <Typography variant="caption">AZURE CLIENT ID</Typography>
            <CustomInput
              placeholder="AZURE_CLIENT_ID"
              fullWidth
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          <div className={classes.formGroup}>
            <Typography variant="caption">AZURE TENANT ID</Typography>
            <CustomInput
              placeholder="AZURE_TENANT_ID"
              fullWidth
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
            />
          </div>
          <div className={classes.formGroup}>
            <Typography variant="caption">AZURE CLIENT SECRET</Typography>
            <CustomInput
              placeholder="AZURE_CLIENT_SECRET"
              fullWidth
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={classes.buttonGroup}>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          disabled={isLoading}
          onClick={() => onSubmit(clientId, tenantId, clientSecret)}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  credentials: {
    border: '1px solid #fff',
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
      marginBottom: '.3rem'
    },
    '& *': {
      color: '#fff'
    },
    '& input': {
      width: '100%'
    }
  },
  buttonGroup: {
    marginTop: '1rem',

    '& button': {
      padding: '.7rem',
      marginBottom: '1rem'
    }
  }
}))
