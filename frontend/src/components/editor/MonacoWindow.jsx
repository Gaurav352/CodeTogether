import React from 'react';
import Editor from '@monaco-editor/react';
import useWorkspaceStore from '../../zustand/useWorkspaceStore';
import useEditorStore from '../../zustand/useEditorStore';
export default function MonacoWindow({ theme, language, activeFile }) {
    const {roomId}=useWorkspaceStore();
    const {updateFileContent}=useEditorStore();
    const handleEditorChange = (newValue)=>{
        if(activeFile && activeFile?._id){
            updateFileContent(activeFile._id,newValue,roomId);
        }
    }
  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-brand-purple/10 shadow-inner bg-[#1e1e1e]">
      <Editor
        height="100%"
        language={language}
        theme={theme}
        onChange={handleEditorChange}
        path={activeFile}
        value={activeFile?.content || ""} 
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