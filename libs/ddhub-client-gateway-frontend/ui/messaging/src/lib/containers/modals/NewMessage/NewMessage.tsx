import { FC } from 'react';
import {
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  Stack,
} from '@mui/material';
import {
  CloseButton,
  Dialog,
  GenericTable,
  RolesIcon,
  Steps,
} from '@ddhub-client-gateway-frontend/ui/core';
import {
  SUCCESS_MODAL_HEADERS,
  FAIL_MODAL_HEADERS,
  useNewMessageEffects,
} from './NewMessage.effects';
import { useStyles } from './NewMessage.styles';

export const NewMessage: FC = () => {
  const { classes } = useStyles();
  const {
    open,
    closeModal,
    details,
    activeStep,
    navigateToStep,
    successDids,
    failedDids,
    modalSteps,
  } = useNewMessageEffects();
  return (
    <Dialog open={open} onClose={closeModal} paperClassName={classes.paper}>
      <DialogContent sx={{ padding: 0 }}>
        <Box>
          <Grid container className={classes.content} flexDirection={'row'}>
            <Grid item xs={4}>
              <Box className={classes.infoWrapper}>
                <Box width={31} height={31}>
                  <RolesIcon />
                </Box>

                <Box display="flex" alignItems="center" mt={3} mb={1.375}>
                  <Typography className={classes.infoTitle}>
                    Recipients
                  </Typography>
                </Box>

                <Stack direction="column">
                  <Typography className={classes.label} variant="body2">
                    Client Gateway Message ID
                  </Typography>
                  <Box display="flex">
                    <Typography
                      className={classes.value}
                      variant="body2"
                      noWrap
                    >
                      {details?.clientGatewayMessageId}
                    </Typography>
                  </Box>

                  <Box className={classes.divider} />
                  <Steps
                    steps={modalSteps}
                    activeStep={activeStep}
                    setActiveStep={navigateToStep}
                  />
                </Stack>
              </Box>
            </Grid>
            <Grid item className={classes.contentWrapper} xs={8}>
              {activeStep === 0 && (
                <>
                  <Box display="flex" mb={1.25}>
                    <Typography
                      className={`${classes.value} ${classes.valueSuccess}`}
                      variant="body2"
                      noWrap
                    >
                      {successDids.length} Succeeded
                    </Typography>
                  </Box>
                  <GenericTable
                    headers={SUCCESS_MODAL_HEADERS}
                    tableRows={successDids}
                    showFooter={true}
                    showSearch={false}
                    containerProps={{ style: { boxShadow: 'none' } }}
                    stripedTable={true}
                    defaultSortBy="did"
                    defaultOrder="asc"
                    customStyle={{ tableMinWidth: 'auto' }}
                    rowsPerPageOptions={[]}
                  />
                </>
              )}
              {activeStep !== 0 && (
                <>
                  <Box display="flex" mb={1.25}>
                    <Typography
                      className={`${classes.value} ${classes.valueFailed}`}
                      variant="body2"
                      noWrap
                    >
                      {failedDids.length} Failed
                    </Typography>
                  </Box>
                  <GenericTable
                    headers={FAIL_MODAL_HEADERS}
                    tableRows={failedDids}
                    showFooter={true}
                    showSearch={false}
                    containerProps={{ style: { boxShadow: 'none' } }}
                    stripedTable={true}
                    defaultSortBy="did"
                    defaultOrder="asc"
                    customStyle={{ tableMinWidth: 'auto' }}
                    rowsPerPageOptions={[]}
                  />
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Box className={classes.closeButtonWrapper}>
          <CloseButton onClose={closeModal} />
        </Box>
      </DialogActions>
    </Dialog>
  );
};
