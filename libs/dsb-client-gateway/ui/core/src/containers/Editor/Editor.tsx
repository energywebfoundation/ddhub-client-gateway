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
  language: string;
  field: GenericFormField;
  register: UseFormRegister<FieldValues>;
  control: Control<FieldValues>;
  showPlaceholder?: boolean;
}

export const Editor: FC<EditorProps> = memo(
  ({ language, field, register, control, showPlaceholder = true }) => {
    const { classes } = useStyles();
    const {
      isEditorReady,
      handlePlaceholder,
      handleEditorDidMount,
      placeholder,
      options,
    } = useEditorEffects();

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
            render={({ field: { value, onChange }}) => {
              return (
                <MonacoEditor
                  height="calc(100% - 19px)"
                  theme="vs-dark"
                  language={language}
                  options={options}
                  onChange={(value: string | undefined) => {
                    onChange(value);
                  }}
                  value={value}
                  onMount={handleEditorDidMount}
                  loading={<CircularProgress style={{ width: '25px', height: '25px' }} />}
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
