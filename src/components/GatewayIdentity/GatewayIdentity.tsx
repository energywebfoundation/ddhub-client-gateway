import React, { useState } from 'react'
import { Button, InputBase, makeStyles, Theme, Typography, withStyles } from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import { CustomInput } from 'components/CustomInput/CustomInput'
import { snip, StringType } from 'utils'

type GatewayIdentityProps = {
    did?: string
    publicKey?: string
    isLoading: boolean
    error: string
    onSubmit: (privateKey: string) => void
}

export const GatewayIdentity = ({
    did,
    publicKey,
    isLoading,
    error,
    onSubmit
}: GatewayIdentityProps) => {
    const classes = useStyles()
    const [privateKey, setPrivatekey] = useState('')
    return (
        <div>
            <div className={classes.credentials}>
                <div className={classes.credentialsHeader}>
                    <Typography variant="h6">MESSAGE BROKER <br /> CREDENTIALS</Typography>
                    <InfoIcon />
                </div>

                <div className={classes.form}>
                    <div className={classes.formGroup}>
                        <Typography variant="caption">DID</Typography>
                        <CustomInput
                            placeholder={did
                                ? snip(did, StringType.DID)
                                : `DID known once private key is set`}
                            fullWidth
                            disabled
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <Typography variant="caption">PUBLIC KEY</Typography>
                        <CustomInput
                            placeholder={publicKey
                                ? snip(publicKey, StringType.HEX_COMPRESSED)
                                : `Public key known once private key is set`}
                            fullWidth
                            disabled
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <Typography variant="caption">PRIVATE KEY</Typography>
                        <CustomInput
                            fullWidth
                            value={privateKey}
                            onChange={(e) => setPrivatekey(e.target.value)}
                        />
                    </div>

                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        disabled={true}
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
