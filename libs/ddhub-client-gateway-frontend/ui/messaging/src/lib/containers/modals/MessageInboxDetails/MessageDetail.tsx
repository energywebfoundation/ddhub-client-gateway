import { FC } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useStyles } from './MessageInboxDetails.styles';
import { CopyToClipboard } from '@ddhub-client-gateway-frontend/ui/core';
import { capitalize, isObject } from 'lodash';
import { DateTime } from 'luxon';

interface MessageDetailProps {
  field: {
    label: string;
    value: string;
    valueArray?: any[];
    isEntryView?: boolean;
    copy?: boolean;
    copyValue?: string;
  };
}

/* eslint-disable no-useless-escape */
const isISODateString = (value: string) =>
  /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/.test(
    value
  );
/* eslint-enable no-useless-escape */

export const MessageDetail: FC<MessageDetailProps> = ({
  field,
}: MessageDetailProps) => {
  const { classes } = useStyles();
  let valueFieldText = field.value;

  if (isISODateString(valueFieldText)) {
    const valueAsDateTime = DateTime.fromISO(valueFieldText);
    if (valueAsDateTime.isValid) {
      valueFieldText = valueAsDateTime.toFormat('dd/MM/yyyy HH:mm:ss');
    }
  }

  const parsedArrayItem: any[] = [];
  let payloadArray: any[] = [];

  if (field.valueArray?.length !== undefined) {
    payloadArray = field.valueArray;
  } else {
    payloadArray = [field.valueArray];
  }

  if (payloadArray.length) {
    payloadArray.map((val: any, index: number) => {
      if (typeof val === 'string' || typeof val === 'number') {
        valueFieldText += val;

        if (index !== payloadArray.length - 1) {
          valueFieldText += ', ';
        }
      } else if (isObject(val)) {
        Object.entries(val).forEach(([name, value]) => {
          const validValue =
            typeof value === 'string' || typeof value === 'number';

          parsedArrayItem.push({
            label: capitalize(name.replace(/([a-z])([A-Z])/g, '$1 $2')),
            value: validValue ? value.toString() : '',
          });
        });
      }
    });
  }

  return (
    <Box display="flex">
      <Stack direction={field.isEntryView ? 'row' : 'column'}>
        <Box display="flex">
          <Typography
            className={field.isEntryView ? classes.labelText : classes.label}
            variant="body2"
            pr="14px"
          >
            {field.label}
            {field.isEntryView ? ':' : ''}
          </Typography>
        </Box>

        <Box display="flex">
          {valueFieldText && (
            <>
              <Typography
                className={
                  field.isEntryView ? classes.label : classes.labelText
                }
                variant="body2"
              >
                {valueFieldText}
              </Typography>
              {field.copy && (
                <CopyToClipboard text={field.copyValue || field.value} />
              )}
            </>
          )}
        </Box>
      </Stack>
      {parsedArrayItem.length !== 0 && (
        <Stack direction="column">
          {parsedArrayItem?.map((item: any) => {
            return (
              <Box display="flex" ml={1}>
                <Stack direction="row">
                  <Box display="flex">
                    <Typography
                      className={classes.labelText}
                      variant="body2"
                      pr="14px"
                    >
                      {item.label}:
                    </Typography>
                  </Box>
                  <Box display="flex">
                    <Typography className={classes.label} variant="body2">
                      {item.value ?? '-'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};
