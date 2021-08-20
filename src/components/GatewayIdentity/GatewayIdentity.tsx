import React, { useEffect, useState } from 'react'
import { Button, makeStyles, Theme, Typography } from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import swal from 'sweetalert'
import { CustomInput } from '../../components/CustomInput/CustomInput'
import { EnrolmentState, snip, StringType } from '../../utils'

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
    const classes = useStyles()
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
                    <Typography variant="h6">GATEWAY IDENTITY</Typography>
                    <InfoIcon />
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
                        <Typography
                            className={classes.id}
                            variant="h6"
                        >
                            {did ? snip(did, StringType.DID) : address}
                        </Typography>
                    </div>
                )}

                <div className={classes.formGroup}>
                    <Typography variant="caption">PRIVATE KEY</Typography>
                    <CustomInput
                        fullWidth
                        value={privateKey}
                        onChange={(e) => setPrivatekey(e.target.value)}
                    />
                </div>
            </div>
            <div className={classes.buttonGroup}>

                {showEnrolButton && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        disabled={isLoading}
                        onClick={() => onEnrol()} // tood: need to "resume" i.e. use a different private key
                    >
                        Enrol
                    </Button>
                )}

                <Button
                    variant="outlined"
                    color="secondary"
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
                    variant="outlined"
                    color="secondary"
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

const useStyles = makeStyles((theme: Theme) => ({
    credentials: {
        border: '1px solid #fff',
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
    },
}))
