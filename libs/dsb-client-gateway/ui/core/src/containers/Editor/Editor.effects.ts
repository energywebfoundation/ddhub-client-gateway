import { useState, useRef } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const useEditorEffects = () => {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    setIsEditorReady(true);
    monacoRef.current = editor;
    editor.onDidBlurEditorWidget(() => {
      if (!editor.getValue()) {
        setShowPlaceholder(true);
      }
    });
  };

  const handlePlaceholder = () => {
    if (!isEditorReady) return;

    setShowPlaceholder(false);
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
    showPlaceholder,
    isEditorReady,
    handleEditorDidMount,
    handlePlaceholder,
    options
  };
};
