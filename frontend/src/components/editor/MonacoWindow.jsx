import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { MonacoBinding } from '../../lib/MonacoBinding'; 
import useEditorStore from '../../zustand/useEditorStore';

export default function MonacoWindow({ theme, language }) {
  const activeFile = useEditorStore((s) => s.activeFile);
  const docs = useEditorStore((s) => s.docs);
  const fileId = activeFile?._id;

  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const bindingRef = useRef(null);

  const bindEditor = () => {
    if (!editorRef.current || !monacoRef.current || !fileId || !docs[fileId]) return;

    if (bindingRef.current) {
      bindingRef.current.destroy();
      bindingRef.current = null;
    }
    const model = editorRef.current.getModel();
    if (!model) return;

    const entry = docs[fileId];
    const ytext = entry.ydoc.getText('content');

    // Use your custom binding!
    bindingRef.current = new MonacoBinding(
      ytext,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      entry.provider.awareness,
      monacoRef.current // THIS is what bypasses the Vite error
    );
  };

  const handleMount = (editor, monacoInstance) => {
    editorRef.current = editor;
    monacoRef.current = monacoInstance;
    bindEditor();
  };

  useEffect(() => {
    bindEditor();
    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy();
        bindingRef.current = null;
      }
    };
  }, [fileId, docs]);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-brand-purple/10 shadow-inner bg-[#1e1e1e]">
      <Editor
        key={fileId}
        height="100%"
        language={language}
        theme={theme}
        onMount={handleMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', monospace",
          fontLigatures: true,
          cursorBlinking: "smooth",
          cursorWidth: 2,
          padding: { top: 16 },
          roundedSelection: true,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}