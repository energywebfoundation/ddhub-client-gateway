import { FC } from 'react';
import { Box, CircularProgress } from '@mui/material';
import MonacoEditor from '@monaco-editor/react';
import { useEditorEffects } from './Editor.effects';
import { useStyles } from './Editor.styles';

interface EditorViewProps {
  value: object | string;
}

export const EditorView: FC<EditorViewProps> = ({ value }) => {
  const { classes } = useStyles();
  const { options, formatValue } = useEditorEffects({
    showPlaceholder: false,
  });

  return (
    <Box
      height={132}
      sx={{ position: 'relative', width: '100%', pointerEvents: 'none' }}
    >
      <Box className={classes.wrapper}>
        <MonacoEditor
          height="calc(100% - 19px)"
          theme="vs-dark"
          language="json"
          options={{ ...options, readOnly: true }}
          defaultValue={formatValue(value)}
          loading={
            <CircularProgress style={{ width: '25px', height: '25px' }} />
          }
        />
      </Box>
    </Box>
  );
};
