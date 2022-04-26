import { FC } from 'react';
import { Box, CircularProgress } from '@mui/material';
import MonacoEditor from '@monaco-editor/react';
import { useEditorEffects } from './Editor.effects';
import { useStyles } from './Editor.styles';

interface EditorViewProps {
  value: string;
}

export const EditorView: FC<EditorViewProps> = ({ value }) => {
  const { classes } = useStyles();
  const { options } = useEditorEffects(false);

  return (
    <Box height={132} sx={{ position: 'relative', width: '100%' }}>
      <Box className={classes.wrapper}>
        <MonacoEditor
          height="calc(100% - 19px)"
          theme="vs-dark"
          language="json"
          options={{ ...options, readOnly: true }}
          defaultValue={
            value ? JSON.stringify(JSON.parse(value), null, 2) : value
          }
          loading={
            <CircularProgress style={{ width: '25px', height: '25px' }} />
          }
        />
      </Box>
    </Box>
  );
};
