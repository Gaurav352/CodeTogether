import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { 
  Play, 
  Loader2, 
  Terminal, 
  Keyboard, 
  Files, 
  PanelRightClose, 
  PanelRightOpen 
} from "lucide-react";
import FileExplorer from "./FileExplorer";

const CodeSpace = () => {
  const [sourceCode, setSourceCode] = useState("// Write your code here\nconsole.log('Hello, World!');");
  const [userInput, setUserInput] = useState("");
  const [output, setOutput] = useState("Output will appear here...");
  const [isLoading, setIsLoading] = useState(false);

  // --- Layout State ---
  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(true);
  const [isIOOpen, setIsIOOpen] = useState(true); // Input/Output Panel

  const handleRunCode = () => {
    setIsLoading(true);
    setOutput("Running...");
    // Force open I/O panel if closed so user sees output
    if (!isIOOpen) setIsIOOpen(true);

    setTimeout(() => {
      setOutput(`> Hello, World!\n> Received Input: ${userInput}\n> Process exited with code 0`);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-full w-full bg-[#0F172A] overflow-hidden">
      
      {/* 1. ACTIVITY BAR (Far Left Strip) */}
      <div className="w-12 border-r border-muted/20 flex flex-col items-center py-4 gap-4 bg-[#0F172A] shrink-0 z-10">
         <button 
           onClick={() => setIsFileExplorerOpen(!isFileExplorerOpen)}
           className={`p-2 rounded-lg transition-colors ${isFileExplorerOpen ? 'text-white bg-white/10' : 'text-muted hover:text-white'}`}
           title="Toggle File Explorer"
         >
           <Files size={20} />
         </button>
      </div>

      {/* 2. FILE EXPLORER (Collapsible) */}
      <FileExplorer isOpen={isFileExplorerOpen} />

      {/* 3. MAIN EDITOR AREA */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-[#1e1e1e]">
        
        {/* Editor Toolbar */}
        <div className="h-12 bg-surface/50 border-b border-muted/20 flex items-center justify-between px-4 backdrop-blur shrink-0">
            {/* File Name */}
            <div className="flex items-center gap-3">
                <span className="text-xs text-muted font-mono bg-white/5 px-2 py-1 rounded">main.js</span>
            </div>
            
            <div className="flex items-center gap-3">
                {/* Run Button */}
                <button 
                    onClick={handleRunCode}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wide transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                    Run
                </button>

                {/* Toggle I/O Panel Button */}
                <button 
                  onClick={() => setIsIOOpen(!isIOOpen)}
                  className={`p-1.5 rounded-md transition-colors ${isIOOpen ? 'text-secondary bg-secondary/10' : 'text-muted hover:text-white'}`}
                  title="Toggle Output Panel"
                >
                  {isIOOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
                </button>
            </div>
        </div>

        {/* Monaco Editor (Takes remaining space) */}
        <div className="flex-1 relative overflow-hidden">
             <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={sourceCode}
                onChange={(value) => setSourceCode(value)}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 16 },
                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                    automaticLayout: true, // IMPORTANT: Resizes editor when panels open/close
                }}
            />
        </div>
      </div>

      {/* 4. I/O PANEL (Collapsible, Right Side) */}
      {isIOOpen && (
        <div className="w-80 border-l border-muted/20 bg-[#0F172A] flex flex-col shrink-0 transition-all duration-300 animate-in slide-in-from-right-10">
            
            {/* Input Section (Top Half) */}
            <div className="h-1/2 flex flex-col border-b border-muted/20">
                <div className="h-9 flex items-center px-4 gap-2 bg-[#1e293b] border-b border-muted/10">
                    <Keyboard size={14} className="text-muted" />
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Input</span>
                </div>
                <textarea 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="STDIN..."
                    className="flex-1 w-full bg-[#0F172A] text-white p-3 resize-none focus:outline-none font-mono text-sm placeholder:text-muted/30"
                />
            </div>

            {/* Output Section (Bottom Half) */}
            <div className="flex-1 flex flex-col min-h-0">
                 <div className="h-9 flex items-center px-4 gap-2 bg-[#1e293b] border-b border-muted/10">
                    <Terminal size={14} className="text-muted" />
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Output</span>
                </div>
                <div className="flex-1 p-3 overflow-auto">
                    <pre className={`${output.startsWith("Error") ? "text-red-400" : "text-secondary"} whitespace-pre-wrap font-mono text-sm leading-relaxed`}>
                        {output}
                    </pre>
                </div>
            </div>

        </div>
      )}

    </div>
  );
};

export default CodeSpace;