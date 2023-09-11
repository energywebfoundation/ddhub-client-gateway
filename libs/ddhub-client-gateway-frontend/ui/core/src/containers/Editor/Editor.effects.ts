import { useState, useRef } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { parseJson } from '@ddhub-client-gateway-frontend/ui/utils';

type TUseEditorEffects = {
  showPlaceholder?: boolean;
};

export const useEditorEffects = ({ showPlaceholder }: TUseEditorEffects) => {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [placeholder, setPlaceholder] = useState(true);

  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    setIsEditorReady(true);
    monacoRef.current = editor;
    monacoRef.current.getAction('editor.action.formatDocument').run();

    if (!showPlaceholder) return;

    editor.onDidBlurEditorWidget(() => {
      if (!editor.getValue()) {
        setPlaceholder(true);
      }
    });
  };

  const handlePlaceholder = () => {
    if (!isEditorReady || !showPlaceholder) return;

    setPlaceholder(false);
    monacoRef.current && monacoRef.current?.layout();
    monacoRef.current && monacoRef.current?.focus();
  };

  const options: monaco.editor.IStandaloneEditorConstructionOptions = {
    minimap: {
      enabled: false,
    },
    scrollbar: {
      vertical: 'auto',
    },
    fontFamily: 'Source Code Pro',
    automaticLayout: true,
    wordBasedSuggestions: false,
    quickSuggestions: false,
    snippetSuggestions: 'none',
    autoClosingBrackets: 'always',
    autoClosingQuotes: 'always',
    formatOnPaste: true,
    formatOnType: true,
    scrollBeyondLastLine: true,
    fontSize: 12,
    lineNumbersMinChars: 3,
    lineDecorationsWidth: 3,
    tabSize: 2,
    suggestOnTriggerCharacters: false,
  };

  const formatValue = (value: object | string) => {
    return parseJson(value);
  };

  return {
    placeholder,
    isEditorReady,
    handleEditorDidMount,
    handlePlaceholder,
    options,
    formatValue,
  };
};
