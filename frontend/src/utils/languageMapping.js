export const extensionToLanguage = {
    'js': 'javascript',
    'ts': 'typescript',
    'cpp': 'cpp',
    'c': 'c',
    'h': 'cpp',         
    'hpp': 'cpp',
    'cs': 'csharp',
    'java': 'java',
    'py': 'python',
    'go': 'go',
    'rs': 'rust',
    'php': 'php',
    'rb': 'ruby',
};

export const getLangageFromExtension=(fileName)=>{
    const lastDotIndex=fileName.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === 0) {
        if (fileName === 'Dockerfile') return 'dockerfile';
        if (fileName === 'Makefile') return 'makefile';
        return 'plaintext';
    }
    const ext = fileName.slice(lastDotIndex + 1).toLowerCase();
    return extensionToLanguage[ext] || 'plaintext';
}