export const buildFileTree = (folders, files) => {
  const folderMap = {};
  const rootItems = [];

  // --- HELPER: Safely get a String ID ---
  // Handles null, undefined, String, ObjectId, or Populated Object
  const getId = (item) => {
      if (!item) return null;
      if (typeof item === 'string') return item;      // Already a string ID
      if (item._id) return item._id.toString();       // It's a populated object (file.folder = { _id: ... })
      return item.toString();                         // It's an ObjectId
  };

  // 1. Map all Folders
  folders.forEach((folder) => {
    const id = getId(folder._id);
    const parentId = getId(folder.parent);

    folderMap[id] = {
      id: id,
      name: folder.name,
      isFolder: true,
      parentId: parentId,
      items: [], // Children container
    };
  });

  // 2. Process Files and link to Folders
  files.forEach((file) => {
    // CRITICAL FIX: Ensure we extract the ID correctly
    // This works even if file.folder is populated or raw ObjectId
    const parentId = getId(file.folder); 
    const fileId = getId(file._id);

    const fileNode = {
      id: fileId,
      name: file.name,
      isFolder: false,
      parentId: parentId,
    };

    // 3. The Linking Logic
    if (parentId && folderMap[parentId]) {
      // ✅ FOUND PARENT: Add to folder's items
      folderMap[parentId].items.push(fileNode);
    } else {
      // ❌ NO PARENT (or parent not found): Add to Root
      rootItems.push(fileNode);
    }
  });

  // 4. Link Nested Folders
  Object.values(folderMap).forEach((folder) => {
    if (folder.parentId && folderMap[folder.parentId]) {
      folderMap[folder.parentId].items.push(folder);
    } else {
      rootItems.push(folder);
    }
  });

  return {
    id: "root",
    name: "root",
    isFolder: true,
    items: rootItems,
  };
};