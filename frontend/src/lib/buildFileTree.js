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