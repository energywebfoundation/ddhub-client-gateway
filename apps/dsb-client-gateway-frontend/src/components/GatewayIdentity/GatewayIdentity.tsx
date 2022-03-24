import { useEffect, useState } from 'react'
import swal from 'sweetalert'
import {
  Button,
  Tooltip,
  Typography,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { CustomInput } from '../../components/CustomInput/CustomInput';
import { EnrolmentState, snip, StringType } from '../../utils';
import { makeStyles } from 'tss-react/mui';

type GatewayIdentityProps = {
  did?: string
  address: string
  balance?: boolean
  enroled?: EnrolmentState
  isLoading: boolean
  onCreate: (privateKey?: string) => void
  onEnrol: () => void
}
export const GatewayIdentity = ({
  did,
  address,
  balance,
  enroled,
  isLoading,
  onCreate,
  onEnrol
}: GatewayIdentityProps) => {
  const { classes } = useStyles()
  const [privateKey, setPrivatekey] = useState('')
  const [statusText, setStatusText] = useState('')
  const [showEnrolButton, setShowEnrolButton] = useState(false)
  useEffect(() => {
    if (enroled?.approved) {
      setShowEnrolButton(false)
      return setStatusText('Enrolment complete')
    }
    if (enroled?.waiting) {
      setShowEnrolButton(false)
      return setStatusText('Awaiting approval')
    }
    if (address && !did) {
      setShowEnrolButton(true)
      if (!balance) {
        return setStatusText('Funds required')
      } else {
        return setStatusText('Ready to enrol')
      }
    }
  }, [did, address, balance, enroled])
  return (
    <div className={classes.credentials}>
      <div className={classes.formGroup}>
        <div className={classes.credentialsHeader}>
          <Typography variant="h6">Gateway Identity</Typography>
          <Tooltip
            title="Configure and enrol the gateway as a DSB user using Energy Web Switchboard. You need
                        to do this before the gateway can publish/subscribe to messages."
          >
            <InfoIcon />
          </Tooltip>
        </div>
        {statusText && (
          <div className={classes.formGroup}>
            <Typography variant="caption">STATUS</Typography>
            <Typography variant="h6">{statusText}</Typography>
          </div>
        )}
        {(did || address) && (
          <div className={classes.formGroup}>
            <Typography variant="caption">ID</Typography>
            <Typography className={classes.id} variant="h6">
              {did ? snip(did, StringType.DID) : address}
            </Typography>
          </div>
        )}

        <div className={classes.formGroup}>
          <Typography variant="caption">Private key</Typography>
          <CustomInput fullWidth value={privateKey} onChange={(e) => setPrivatekey(e.target.value)} />
        </div>
      </div>
      <div className={classes.buttonGroup}>
        {showEnrolButton && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            onClick={() => onEnrol()} // tood: need to "resume" i.e. use a different private key
          >
            Enrol
          </Button>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
          onClick={() => {
            setPrivatekey('')
            onCreate()
          }}
        >
          Generate Keys
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
          onClick={() => {
            if (!privateKey) {
              return swal('Error', 'No private key set', 'error')
            }
            setPrivatekey('')
            onCreate(privateKey)
          }}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

const useStyles = makeStyles()((theme) => ({
  credentials: {
    borderRadius: '6px',
    background: theme.palette.primary.dark,
    padding: '2rem',
    height: '550px',
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
  description: {
    margin: '1rem 0',
    color: '#ccc'
  },
  id: {
    fontSize: '.9rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginBottom: '1.2rem',
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
