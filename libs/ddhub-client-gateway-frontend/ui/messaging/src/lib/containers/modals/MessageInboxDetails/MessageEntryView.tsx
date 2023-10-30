import React, { FC, MouseEvent, useState } from 'react';
import { useStyles } from './MessageInboxDetails.styles';
import { Box, Typography, Collapse, IconButton } from '@mui/material';
import { ChevronDown, ChevronUp } from 'react-feather';
import { MessageDetail } from './MessageDetail';

interface MessageEntryViewProps {
  index: number;
  items: any[];
}

export const MessageEntryView: FC<MessageEntryViewProps> = ({
  index,
  items = [],
}: MessageEntryViewProps) => {
  const { classes } = useStyles();
  const [expandResponse, setExpandResponse] = useState<boolean>(false);

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        mt={2}
      >
        <Typography className={classes.entryText}>Entry {index + 1}</Typography>
        <IconButton
          onMouseDown={(event: MouseEvent<HTMLElement>) => {
            event.stopPropagation();
            setExpandResponse(!expandResponse);
          }}
          className={classes.accordion}
        >
          {!expandResponse && <ChevronDown size={18} />}
          {expandResponse && <ChevronUp size={18} />}
        </IconButton>
      </Box>
      <Collapse in={expandResponse}>
        <Box key={index}>
          {items.map((item: any, idx: number) => (
            <MessageDetail key={idx} field={item} />
          ))}
        </Box>
      </Collapse>
    </>
  );
};
