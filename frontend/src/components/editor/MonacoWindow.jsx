import React from 'react';
import Editor from '@monaco-editor/react';

export default function MonacoWindow({ theme, language, activeFile }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-brand-purple/10 shadow-inner bg-[#1e1e1e]">
      <Editor
        height="100%"
        language={language}
        theme={theme}
        path={activeFile} // Monaco uses this for internal Model management
        defaultValue={`// Welcome to CodeSync\n// Active File: ${activeFile}\n\nconsole.log("Let's build something epic.");`}
        options={{
          minimap: { enabled: false }, // Turn off minimap to keep it clean
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