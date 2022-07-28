import { FC } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useStyles } from './SettingsItem.styles';
import Image from 'next/image';

interface SettingsItemProps {
  title: string;
  icon: JSX.Element | string;
  content: React.ReactElement;
  footer?: React.ReactElement;
  buttonText?: string;
  onClick?: () => void;
}

export const SettingsItem: FC<SettingsItemProps> = ({
  icon,
  title,
  content,
  footer,
  buttonText,
  onClick,
}) => {
  const { classes } = useStyles();
  return (
    <Box className={classes.wrapper}>
      <Box display="flex">
        <Box className={classes.iconWrapper}>
          {typeof icon === 'string' ? (
            <Image src={icon} alt={`${title} icon`} height={48} width={48} />
          ) : (
            icon
          )}
        </Box>
        <Stack spacing={1}>
          <Typography variant="body2" className={classes.title}>
            {title}
          </Typography>
          {content}
        </Stack>
      </Box>
      <Box className={classes.footer}>
        <Box flexGrow={1}>{footer}</Box>
        {buttonText && buttonText.length > 0 && (
          <Box display="flex" alignItems="flex-end">
            <Button
              type="submit"
              variant="contained"
              className={classes.button}
              onClick={onClick}
            >
              <Typography className={classes.buttonText} variant="body2">
                {buttonText}
              </Typography>
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
