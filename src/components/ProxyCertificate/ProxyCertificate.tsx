import react, { useState } from 'react'
import { Button, makeStyles, Theme, Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info'
import { CustomInput } from 'components/CustomInput/CustomInput';

type ProxyCertificateProps = {
    originalClientId: string
    originalTenantId: string
    isLoading: boolean
    error: string
    onSubmit: (clientId: string, tenantId: string, clientSecret: string) => void
}

export const ProxyCertificate = ({
    originalClientId,
    originalTenantId,
    isLoading,
    error,
    onSubmit
}: ProxyCertificateProps) => {
    const classes = useStyles()

    const [clientId, setClientId] = useState(originalClientId)
    const [tenantId, setTenantId] = useState(originalTenantId)
    const [clientSecret, setClientSecret] = useState('')

    return (
        <div>
            <div className={classes.credentials}>
                <div className={classes.credentialsHeader}>
                    <Typography variant="h6">OUTBOUND CERTIFICATE</Typography>
                    <InfoIcon />
                </div>

                <div className={classes.form}>
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

                    <Button
                        variant="outlined"
                        style={{ marginTop: '4rem' }}
                        color="secondary"
                        fullWidth
                        disabled={isLoading}
                        onClick={() => onSubmit(clientId, tenantId, clientSecret)}
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
}));
