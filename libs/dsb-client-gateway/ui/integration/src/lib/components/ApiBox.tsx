import Box from '@mui/material/Box';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';
import { Mail } from 'react-feather';
import React from 'react';
import { useStyles } from './ApiBox.styles';
import { CreateButton } from '@dsb-client-gateway/ui/core';
import { useRouter } from 'next/router';
import Link from 'next/link';

export interface ApiBoxProps {
  icon: React.ReactNode;
  url: string;
  title: string;
  subtitle: string;
}

export const ApiBox = ({ icon, url, title, subtitle }: ApiBoxProps) => {
  const { classes } = useStyles();
  return (
    <Card>
      <Box>
        <CardHeader
          avatar={<Avatar className={classes.avatar}>{icon}</Avatar>}
          title={title}
          subheader={subtitle}
        />
        <CardContent>
          <Stack direction='row' justifyContent="flex-end">
            <a href={url} target="_blank" className={classes.link}>
              Open
            </a>
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};
