import { FC } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useStyles } from './SettingsItem.styles';

interface SettingsItemProps {
  title: string;
  icon: string;
  buttonText: string;
  buttonText2?: string;
  content: React.ReactElement;
  onClick: () => void;
  onClick2?: () => void;
  footer?: React.ReactElement;
}

export const SettingsItem: FC<SettingsItemProps> = ({
  icon,
  title,
  buttonText,
  buttonText2,
  onClick,
  onClick2,
  content,
  footer,
}) => {
  const { classes } = useStyles();
  return (
    <Box className={classes.wrapper}>
      <Box display="flex">
        <Box className={classes.iconWrapper}>
          <img src={icon} alt={`${title} icon`} />
        </Box>
        <Box display="flex" flexDirection="column">
          <Typography variant="body2" className={classes.title}>
            {title}
          </Typography>
          {content}
        </Box>
      </Box>
      <Box className={classes.footer}>
        <Box flexGrow={1}>{footer}</Box>
        <Box display="flex" alignItems="flex-end">
          { buttonText2 && (
            <Button
              type="button"
              variant="outlined"
              className={classes.secondaryButton}
              onClick={onClick2}
            >
              <Typography className={classes.buttonText2} variant="body2">
                {buttonText2}
              </Typography>
            </Button>
          )}

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
      </Box>
    </Box>
  );
};
