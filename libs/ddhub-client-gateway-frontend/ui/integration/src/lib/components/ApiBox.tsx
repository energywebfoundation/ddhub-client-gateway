import Box from '@mui/material/Box';
import { Avatar, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import React from 'react';
import { useStyles } from './ApiBox.styles';

export interface ApiBoxProps {
  icon: React.ReactNode;
  url: string;
  title: string;
  subtitle: string;
}

export const ApiBox = ({ icon, url, title, subtitle }: ApiBoxProps) => {
  const { classes } = useStyles();
  return (
    <Card className={classes.card}>
      <Box>
        <CardHeader
          avatar={<Avatar className={classes.avatar}>{icon}</Avatar>}
          title={<Typography variant="body2" className={classes.cardTitle}>{title}</Typography>}
          subheader={<Typography variant="body2" className={classes.cardSubtitle}>{subtitle}</Typography>}
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <Stack direction="row" justifyContent="flex-end">
            <a href={url} target="_blank" className={classes.link}>
              Open
            </a>
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};
