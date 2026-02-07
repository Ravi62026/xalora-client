import React, { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({
  value,
  onChange,
  language = "javascript",
  height = "400px",
  theme = "vs-dark",
  readOnly = false,
  className = "",
  errorMarkers = [], // New prop for error markers
  onRun, // New prop for run functionality
  executing = false, // New prop for execution state
}) => {
  const editorRef = useRef(null);

  // Language mapping for Monaco Editor
  const getMonacoLanguage = (lang) => {
    const languageMap = {
      js: "javascript",
      py: "python",
      java: "java",
      cpp: "cpp",
    };
    return languageMap[lang] || "plaintext";
  };

  // Set error markers in the editor
  const setErrorMarkers = (markers) => {
    if (editorRef.current && markers.length > 0) {
      const monaco = window.monaco;
      if (monaco) {
        const model = editorRef.current.getModel();
        if (model) {
          monaco.editor.setModelMarkers(model, "owner", markers);
        }
      }
    } else if (editorRef.current) {
      // Clear markers
      const monaco = window.monaco;
      if (monaco) {
        const model = editorRef.current.getModel();
        if (model) {
          monaco.editor.setModelMarkers(model, "owner", []);
        }
      }
    }
  };

  useEffect(() => {
    setErrorMarkers(errorMarkers);
  }, [errorMarkers]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 4,
      insertSpaces: true,
      wordWrap: "on",
      lineNumbers: "on",
      renderLineHighlight: "line",
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: readOnly,
      cursorStyle: "line",
      mouseWheelZoom: true,
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      // Trigger run code when Ctrl+Enter is pressed
      if (onRun) onRun();
    });

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => {
        // Trigger submit when Ctrl+Shift+Enter is pressed
        const submitButton = document.querySelector(
          '[data-action="submit-code"]'
        );
        if (submitButton) submitButton.click();
      }
    );

    // Set initial error markers
    setErrorMarkers(errorMarkers);
  };

  const handleEditorChange = (value) => {
    if (onChange) {
      onChange(value || "");
    }
  };

  return (
    <div
      className={`relative border border-gray-300 rounded-lg overflow-hidden ${className}`}
    >
      {/* Run Button Overlay */}
      {onRun && (
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={onRun}
            disabled={executing}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50 shadow-lg"
            title="Run Code (Ctrl+Enter)"
          >
            {executing ? (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Running</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Run</span>
              </div>
            )}
          </button>
        </div>
      )}
      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={theme}
        options={{
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: readOnly,
          cursorStyle: "line",
          automaticLayout: true,
          fontSize: 14,
          fontFamily:
            "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
          fontLigatures: true,
          lineHeight: 20,
          letterSpacing: 0.5,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          tabSize: 4,
          insertSpaces: true,
          wordWrap: "on",
          lineNumbers: "on",
          glyphMargin: true, // Enable glyph margin for error indicators
          folding: true,
          lineDecorationsWidth: 20,
          lineNumbersMinChars: 3,
          renderLineHighlight: "line",
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          contextmenu: true,
          mouseWheelZoom: true,
          smoothScrolling: true,
          cursorBlinking: "blink",
          cursorSmoothCaretAnimation: true,
          renderWhitespace: "selection",
          renderControlCharacters: false,
          fontWeight: "normal",
          bracketPairColorization: {
            enabled: true,
          },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          padding: {
            top: 16,
            bottom: 16,
          },
          suggest: {
            insertMode: "replace",
            filterGraceful: true,
            showKeywords: true,
            showSnippets: true,
            showClasses: true,
            showFunctions: true,
            showVariables: true,
          },
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false,
          },
          parameterHints: {
            enabled: true,
          },
          autoIndent: "full",
          formatOnPaste: true,
          formatOnType: true,
          // Enable error decorations
          lightbulb: {
            enabled: true,
          },
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }
      />
    </div>
  );
};

export default CodeEditor;
