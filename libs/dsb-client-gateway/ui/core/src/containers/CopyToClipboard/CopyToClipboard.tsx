import { FC, memo } from 'react';
import { Copy } from 'react-feather';
import { Tooltip, IconButton } from '@mui/material';
import { CopyToClipboard as ReactCopyToClipboard } from 'react-copy-to-clipboard';
import { useCopyToClipboardEffects } from './CopyToClipboard.effects';
import { useStyles } from './CopyToClipboard.styles';

interface CopyToClipboardProps {
  text: string;
}

export const CopyToClipboard: FC<CopyToClipboardProps> = memo(({ text }) => {
  const { classes } = useStyles();
  const { showTooltip, onCopy, handleOnTooltipClose } =
    useCopyToClipboardEffects();

  return (
    <ReactCopyToClipboard text={text} onCopy={onCopy}>
      <Tooltip
        open={showTooltip}
        title={'Copied to clipboard!'}
        leaveDelay={1500}
        onClose={handleOnTooltipClose}
        classes={{ tooltip: classes.tooltip }}
      >
        <IconButton className={classes.iconButton}>
          <Copy className={classes.icon} />
        </IconButton>
      </Tooltip>
    </ReactCopyToClipboard>
  );
});

CopyToClipboard.displayName = 'CopyToClipboard';
