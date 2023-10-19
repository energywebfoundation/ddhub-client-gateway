import {
  ArrayFieldTemplateItemType,
  ArrayFieldTemplateProps,
} from '@rjsf/utils';
import { useStyles } from '../../form/FormInput/FormInput.styles';
import {
  AccordionActions,
  Box,
  Button,
  Divider,
  InputLabel,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import React, { useEffect, useState } from 'react';
import { capitalizeFirstLetter } from '@ddhub-client-gateway-frontend/ui/utils';
import { CustomArrayFieldItemTemplate } from './CustomArrayFieldItemTemplate';
import { AlertCircle, CheckCircle, ChevronRight } from 'react-feather';
import { AddBox } from '@mui/icons-material';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: 12,
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ChevronRight size={'0.9rem'} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  fontFamily: theme.typography.h2.fontFamily,
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: theme.palette.common.white,
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export const CustomArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  const { classes, theme } = useStyles();
  const [value, setValue] = useState('');
  const [values, setValues] = useState<string[]>([]);
  const [items, setItems] = useState<ArrayFieldTemplateItemType[]>(props.items);
  const [expanded, setExpanded] = React.useState<number | false>(false);

  useEffect(() => {
    if (!isObjectArray) {
      if (props.items !== items) {
        setItems(
          props.items.map((item, i) => ({ ...item, classes, value: values[i] }))
        );
      }
    }
  }, [props.items]);

  useEffect(() => {
    if (!isObjectArray) {
      if (
        props.formData !== values &&
        props.formData.every((v: string) => !!v)
      ) {
        setValues(props.formData);
      }
    }
  }, [props.formData]);

  const { title } = props;
  const textFieldProps: TextFieldProps = {
    classes: {
      root: classes.root,
    },
    label: '',
    value,
    disabled: !props.canAdd,
    placeholder: 'Enter a value',
    onKeyDown: (e) => {
      if (e.key === 'Enter' && !!value) {
        e.preventDefault();
        props.onAddClick();
        setValues([...values, value]);
        setValue('');
      }
    },
    onChange: (e) => {
      setValue(e.target.value);
    },
  };

  const isObjectArray =
    props.className?.includes('field-array-of-object') || false;

  const handleAccordionChange =
    (index: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? index : false);
    };

  const isValidForm = (form: ArrayFieldTemplateItemType) => {
    return (
      !form.children.props.errorSchema ||
      Object.keys(form.children.props.errorSchema).length === 0
    );
  };

  const allFormsAreValid = (): boolean => {
    return props.items.every((item) => isValidForm(item));
  };

  const renderObjectArray = (items: ArrayFieldTemplateItemType[]) => {
    return items.map((element, index) => {
      const {
        hasMoveUp,
        hasMoveDown,
        hasRemove,
        disabled,
        readonly,
        onReorderClick,
        onDropIndexClick,
        registry,
      } = element;
      const { MoveUpButton, MoveDownButton, RemoveButton } =
        registry.templates.ButtonTemplates;
      return (
        <Accordion
          key={element.key}
          expanded={expanded === index}
          onChange={handleAccordionChange(index)}
        >
          <AccordionSummary>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Typography variant="body2" fontFamily="Bw Gradual">
                Message {index + 1}
              </Typography>
              <Box>
                {isValidForm(element) ? (
                  <CheckCircle color={theme.palette.primary.main} size={16} />
                ) : (
                  <AlertCircle color={theme.palette.warning.main} size={16} />
                )}
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionActions>
            {(hasMoveUp || hasMoveDown) && (
              <MoveUpButton
                disabled={disabled || readonly || !hasMoveUp}
                onClick={onReorderClick(index, index - 1)}
                registry={registry}
              />
            )}
            {(hasMoveUp || hasMoveDown) && (
              <MoveDownButton
                disabled={disabled || readonly || !hasMoveDown}
                onClick={onReorderClick(index, index + 1)}
                registry={registry}
              />
            )}
            {hasRemove && (
              <RemoveButton
                disabled={disabled || readonly || !hasRemove}
                onClick={onDropIndexClick(index)}
                registry={registry}
              />
            )}
          </AccordionActions>
          <AccordionDetails>{element.children}</AccordionDetails>
        </Accordion>
      );
    });
  };

  return (
    <Box>
      {title && (
        <InputLabel className={classes.label}>
          {capitalizeFirstLetter(title)}
        </InputLabel>
      )}
      {!isObjectArray && (
        <>
          <TextField {...textFieldProps} />
          <Box pl={1} pt={2}>
            {items.map((element, index) => {
              return (
                <Box key={element.key}>
                  <CustomArrayFieldItemTemplate
                    {...element}
                    classes={classes}
                    value={
                      element.children.props.formData
                        ? element.children.props.formData
                        : values[index]
                    }
                  />
                </Box>
              );
            })}
          </Box>
        </>
      )}
      {isObjectArray && (
        <>
          <Typography variant="h6" className={classes.listLabel}>
            Message List
          </Typography>
          <Typography variant="body2" className={classes.subtitle}>
            {props.items.length === 0
              ? 'At least one message must be added before continuing.'
              : allFormsAreValid()
              ? 'All messages are valid.'
              : 'All messages must be valid to continue.'}
          </Typography>
          {props.items.length > 0 && renderObjectArray(props.items)}
          <Divider sx={{ margin: '8px 0' }} />
          <Box
            width="100%"
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
          >
            <Button
              variant="text"
              className={classes.button}
              classes={{ endIcon: classes.buttonIcon }}
              endIcon={<AddBox />}
              onClick={props.onAddClick}
              disabled={!props.canAdd}
            >
              <Typography className={classes.buttonText} variant="body2">
                Add message
              </Typography>
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};
