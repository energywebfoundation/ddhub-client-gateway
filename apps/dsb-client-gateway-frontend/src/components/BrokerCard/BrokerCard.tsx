import { Card, Avatar, CardContent, CardHeader, Typography } from '@mui/material';
import { Mail } from 'react-feather';
import React from 'react';
import { useStyles } from './BrokerCard.styles';
import Box from '@mui/material/Box';
import Status, { StatusTypeEnum } from '../Status/Status';

export function BrokerCard() {
  const {classes} = useStyles();
  return (
    <Card>
      <Box>
        <Status text='Online' type={StatusTypeEnum.Up}/>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              <Mail size={20} className={classes.mailIcon}/>
            </Avatar>
          }
        />
        <CardContent>
          <Typography variant='h5'>
            DDHub message broker
          </Typography>
        </CardContent>
      </Box>
    </Card>

  );
}

export default BrokerCard;
