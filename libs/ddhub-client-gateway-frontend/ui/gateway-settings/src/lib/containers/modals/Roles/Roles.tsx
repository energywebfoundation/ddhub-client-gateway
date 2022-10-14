import { FC } from 'react';
import { useStyles } from './Roles.styles';
import {
  Dialog,
  CloseButton,
  RolesIcon,
  CopyToClipboard,
  GenericTable,
} from '@ddhub-client-gateway-frontend/ui/core';
import { Box, Grid, Typography, Stack} from '@mui/material';
import { useRolesEffects } from './Roles.effects';
import {didFormatMinifier} from '@ddhub-client-gateway-frontend/ui/utils';
import { RoleDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ROLES_HEADERS } from './roles-headers';

export const Roles: FC = () => {
  const { classes } = useStyles();
  const { open, closeModal, info } = useRolesEffects();

  return (
    <Dialog open={open} onClose={closeModal} paperClassName={classes.paper}>
      <Grid container className={classes.content}>
        <Grid item xs={4}>
          <Box className={classes.infoWrapper}>
            <Box
              width={31}
              height={31}>
              <RolesIcon/>
            </Box>

            <Box display="flex"  alignItems="center" mt={3} mb={1.375}>
              <Typography className={classes.did}>
                { didFormatMinifier(info.did) }
              </Typography>
              <CopyToClipboard text={info.did} />
            </Box>

            <Stack direction="column">
              <Typography className={classes.label} variant="body2">
                Namespace
              </Typography>
              <Box display="flex">
                <Typography className={classes.value} variant="body2" noWrap>
                  { info.namespace }
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Grid>
        <Grid item className={classes.contentWrapper} xs={8}>
          <Box display="flex" mb={1.25}>
            <Typography className={classes.value} variant="body2" noWrap>
              Roles
            </Typography>
          </Box>
          <GenericTable<RoleDto>
            headers={ROLES_HEADERS}
            tableRows={info.roles}
            showFooter={true}
            showSearch={false}
            containerProps={{ style: { boxShadow: 'none' }}}
            stripedTable={true}
            defaultSortBy='namespace'
            defaultOrder='asc'
            customStyle={{ tableMinWidth: 'auto' }}
          />
        </Grid>
      </Grid>
      <Box className={classes.closeButtonWrapper}>
        <CloseButton onClose={closeModal} />
      </Box>
    </Dialog>
  )
};
