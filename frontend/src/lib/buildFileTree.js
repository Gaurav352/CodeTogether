export default function buildFileTree (folders, files) {
  const tree = [];
  const folderMap = {};

  folders.forEach(folder => {
    folderMap[folder._id] = { ...folder, type: 'folder', isOpen: false, children: [] };
  });

  folders.forEach(folder => {
    if (folder.parent && folderMap[folder.parent]) {
      folderMap[folder.parent].children.push(folderMap[folder._id]);
    } else {
      tree.push(folderMap[folder._id]);
    }
  });

  files.forEach(file => {
    const fileNode = { ...file, type: 'file' };
    
    if (file.folder && folderMap[file.folder]) {
      folderMap[file.folder].children.push(fileNode);
    } else {
      tree.push(fileNode);
    }
  });

  return tree;
};
export const sortFileTree = (nodes) => {
    // 1. Create a shallow copy to avoid mutating React state directly
    const sorted = [...nodes].sort((a, b) => {
        // Define what constitutes a folder (either explicit type or having a children array)
        const aIsFolder = a.type === 'folder' || a.children !== undefined;
        const bIsFolder = b.type === 'folder' || b.children !== undefined;

        // Rule 1: Folders always come first
        if (aIsFolder && !bIsFolder) return -1;
        if (!aIsFolder && bIsFolder) return 1;

        // Rule 2: Alphabetical sorting (case-insensitive)
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

    // 2. Recursively apply this exact same logic to all nested children
    return sorted.map(node => {
        if (node.children) {
            return { ...node, children: sortFileTree(node.children) };
        }
        return node;
    });
};