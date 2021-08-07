import React, { useEffect, useState } from 'react'
import { Button, makeStyles, Theme, Typography } from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import { CustomInput } from 'components/CustomInput/CustomInput'
import { EnrolmentState } from 'utils'

type GatewayIdentityProps = {
    did?: string
    address: string
    balance?: boolean
    enroled?: EnrolmentState
    isLoading: boolean
    error: string
    onSubmit: (privateKey?: string) => void
}

export const GatewayIdentity = ({
    did,
    address,
    balance,
    enroled,
    isLoading,
    error,
    onSubmit
}: GatewayIdentityProps) => {
    const classes = useStyles()
    const [privateKey, setPrivatekey] = useState('')
    const [statusText, setStatusText] = useState('')
    const [showFundedButton, setShowFundedButton] = useState(false)

    useEffect(() => {
        if (address) {
            if (!did) {
                if (!balance) {
                    setShowFundedButton(true)
                    setStatusText('No funds')
                } else {
                    setStatusText('Missing DID')
                }
            } else {
                if (enroled?.ready) {
                    setStatusText('Enroled')
                } else {
                    setStatusText('Awaiting enrolment approval')
                }
            }
        }
    }, [did, address, balance, enroled])

    return (
        <div>
            <div className={classes.credentials}>
                <div className={classes.credentialsHeader}>
                    <Typography variant="h6">GATEWAY IDENTITY</Typography>
                    <InfoIcon />
                </div>

                {statusText && (
                    <div className={classes.description}>
                        <Typography variant="caption">STATUS</Typography>
                        <Typography variant="h6">{statusText}</Typography>
                    </div>
                )}
                {(did || address) && (
                    <div className={classes.description}>
                        <Typography variant="caption">ID</Typography>
                        <Typography className={classes.id} variant="h6">{did || address}</Typography>
                    </div>
                )}

                <div className={classes.form}>
                    <div className={classes.formGroup}>
                        <Typography variant="caption">PRIVATE KEY</Typography>
                        <CustomInput
                            fullWidth
                            value={privateKey}
                            onChange={(e) => setPrivatekey(e.target.value)}
                        />
                    </div>

                    {showFundedButton && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            disabled={isLoading}
                            onClick={() => onSubmit()} // tood: need to "resume" i.e. use a different private key
                            /**
                             * Better API design
                             *  - POST /identity { privateKey } - save private key
                             *  - POST /identity                - generate private key
                             *
                             *      |-> saves + returns { address, publicKey, balance }
                             *
                             * - POST /enrol
                             *
                             *      |-> uses stored identity
                             *      |-> fails if no identity set
                             *      |-> fails if no balance (fetch again)
                             *      \-> returns if already AWAITING_APPROVAL or APPROVED
                             *      |-> creates listener for approval
                             *
                             *  - GET /enrol
                             *
                             *      |-> gets enrolment state
                             *
                             */
                        >
                            I Have Funds
                        </Button>
                    )}

                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        disabled={isLoading}
                        onClick={() => onSubmit()}
                    >
                        Generate Keys
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        disabled={isLoading}
                        onClick={() => onSubmit(privateKey)}
                    >
                        Save
                    </Button>

                    <div className={classes.errorText}>
                        <Typography>{error}</Typography>
                    </div>

                </div>
            </div>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) => ({
    credentials: {
        border: '1px solid #fff',
        padding: '2rem',
    },
    credentialsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#fff'
    },
    description: {
        margin: '1rem 0',
        color: '#ccc'
    },
    id: {
        fontSize: '.9rem'
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
