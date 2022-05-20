import Box from '@mui/material/Box';
import { Avatar, Card, CardContent, CardHeader, Stack } from '@mui/material';
import React from 'react';
import { useStyles } from './ApiBox.styles';
import Link from 'next/link';

export interface ApiBoxProps {
  icon: React.ReactNode;
  url: string;
  title: string;
  subtitle: string;
  isNextLink: boolean;
}

export const ApiBox = ({
  icon,
  url,
  title,
  subtitle,
  isNextLink,
}: ApiBoxProps) => {
  const { classes } = useStyles();
  const displayedUrl = isNextLink ? (
    <Link href={url}>
      <span className={classes.link}>Open</span>
    </Link>
  ) : (
    <a href={url} target="_blank" className={classes.link}>
      Open
    </a>
  );
  return (
    <Card>
      <Box>
        <CardHeader
          avatar={<Avatar className={classes.avatar}>{icon}</Avatar>}
          title={title}
          subheader={subtitle}
        />
        <CardContent>
          <Stack direction="row" justifyContent="flex-end">
            {displayedUrl}
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};
