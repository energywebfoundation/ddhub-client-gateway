import Box from '@mui/material/Box';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { useStyles } from './ApiBox.styles';
import Link from 'next/link';

export interface ApiBoxProps {
  icon: React.ReactNode;
  url: string;
  title: string;
  subtitle: string;
  isNextLink: boolean;
  customLabel?: string;
}

export const ApiBox = ({
  icon,
  url,
  title,
  subtitle,
  isNextLink,
  customLabel = '',
}: ApiBoxProps) => {
  const { classes } = useStyles();
  const displayedUrl = isNextLink ? (
    <Link href={url}>
      <span className={classes.link}>Open</span>
    </Link>
  ) : (
    <a href={url} target="_blank" rel="noreferrer" className={classes.link}>
      Open
    </a>
  );
  return (
    <Card className={classes.card}>
      <Box>
        <CardHeader
          avatar={<Avatar className={classes.avatar}>{icon}</Avatar>}
          title={
            <Typography variant="body2" className={classes.cardTitle}>
              {title}
            </Typography>
          }
          subheader={
            <Typography variant="body2" className={classes.cardSubtitle}>
              {subtitle}
            </Typography>
          }
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <Stack direction="row" justifyContent="flex-end">
            {customLabel ? (
              <Typography variant="body2" className={classes.customLabel}>
                {customLabel}
              </Typography>
            ) : (
              displayedUrl
            )}
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};
