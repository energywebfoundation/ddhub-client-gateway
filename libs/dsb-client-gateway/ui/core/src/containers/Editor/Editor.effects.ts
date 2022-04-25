import { useState, useRef } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const useEditorEffects = (showPlaceholder: boolean) => {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [placeholder, setPlaceholder] = useState(true);

  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    setIsEditorReady(true);
    monacoRef.current = editor;
    monacoRef.current.getAction("editor.action.formatDocument").run();

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

  const options = {
    minimap: {
      enabled: false,
    },
    scrollbar: {
      vertical: 'auto',
    },
    automaticLayout: true,
    wordBasedSuggestions: false,
    quickSuggestions: false,
    snippetSuggestions: 'none',
    autoClosingBrackets: 'always',
    autoClosingQuotes: 'always',
    formatOnPaste: true,
    formatOnType: true,
    scrollBeyondLastLine: true,
    fontSize: 10,
    lineNumbersMinChars: 3,
    lineDecorationsWidth: 3,
    suggestOnTriggerCharacters: false,
  } as monaco.editor.IStandaloneEditorConstructionOptions;

  return {
    placeholder,
    isEditorReady,
    handleEditorDidMount,
    handlePlaceholder,
    options
  };
};
