import { FC, memo } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import {
  Controller,
  Control,
  UseFormRegister,
  FieldValues,
} from 'react-hook-form';
import MonacoEditor from '@monaco-editor/react';
import { GenericFormField } from '../GenericForm/GenericForm.types';
import { useEditorEffects } from './Editor.effects';
import { useStyles } from './Editor.styles';

interface EditorProps {
  field: GenericFormField;
  register: UseFormRegister<FieldValues>;
  control: Control<FieldValues>;
  showPlaceholder?: boolean;
}

export const Editor: FC<EditorProps> = memo(
  ({ field, register, control, showPlaceholder = true }) => {
    const { classes } = useStyles();
    const {
      isEditorReady,
      handlePlaceholder,
      handleEditorDidMount,
      placeholder,
      options,
      formatValue,
    } = useEditorEffects({ showPlaceholder });

    const { name } = register(field.name);

    return (
      <Box height={132} sx={{ position: 'relative' }}>
        {showPlaceholder && placeholder && (
          <Box
            className={classes.wrapper}
            sx={{ zIndex: 1 }}
            onClick={handlePlaceholder}
          >
            <Typography className={classes.placeholder}>
              {isEditorReady && field.inputProps?.placeholder}
            </Typography>
          </Box>
        )}

        <Box className={classes.wrapper}>
          <Controller
            key={`${name}`}
            name={name}
            control={control}
            render={({ field: { value, onChange } }) => {
              const formattedValue =
                typeof value === 'object' ? formatValue(value) : value;
              return (
                <MonacoEditor
                  height="calc(100% - 19px)"
                  theme="vs-dark"
                  language="json"
                  options={options}
                  onChange={(value: string | undefined) => {
                    onChange(value);
                  }}
                  value={formattedValue}
                  onMount={handleEditorDidMount}
                  loading={
                    <CircularProgress
                      style={{ width: '25px', height: '25px' }}
                    />
                  }
                />
              );
            }}
          />
        </Box>
      </Box>
    );
  }
);

Editor.displayName = 'Editor';
