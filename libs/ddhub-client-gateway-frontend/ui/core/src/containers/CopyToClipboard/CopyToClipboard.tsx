import { FC, memo } from 'react';
import { Copy } from 'react-feather';
import { Tooltip, IconButton, Box, BoxProps } from '@mui/material';
import { CopyToClipboard as ReactCopyToClipboard } from 'react-copy-to-clipboard';
import { useCopyToClipboardEffects } from './CopyToClipboard.effects';
import { useStyles } from './CopyToClipboard.styles';

interface CopyToClipboardProps {
  text: string;
  wrapperProps?: BoxProps;
}

export const CopyToClipboard: FC<CopyToClipboardProps> = memo(
  ({ text, wrapperProps }) => {
    const { classes } = useStyles();
    const { showTooltip, onCopy, handleOnTooltipClose } =
      useCopyToClipboardEffects();

    return (
      <Box
        {...wrapperProps}
        onClick={(event: React.MouseEvent<HTMLElement>) =>
          event.stopPropagation()
        }
      >
        <ReactCopyToClipboard text={text} onCopy={onCopy}>
          <Tooltip
            arrow
            open={showTooltip}
            placement="top"
            title={'Copied!'}
            leaveDelay={1000}
            onClose={handleOnTooltipClose}
            classes={{ tooltip: classes.tooltip }}
          >
            <IconButton className={classes.iconButton}>
              <Copy className={classes.icon} />
            </IconButton>
          </Tooltip>
        </ReactCopyToClipboard>
      </Box>
    );
  }
);

CopyToClipboard.displayName = 'CopyToClipboard';
