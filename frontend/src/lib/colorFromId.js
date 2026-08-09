
const USER_COLORS = [
  '#982598', // CodeSync Brand Purple
  '#E491C9', // CodeSync Brand Pink Accent
  '#3b82f6', // Electric Blue
  '#10b981', // Emerald Green
  '#f59e0b', // Amber Gold
  '#8b5cf6', // Vivid Violet
  '#ec4899', // Hot Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f43f5e', // Rose Red
];

export const colorFromId = (userId) => {
  if (!userId) return USER_COLORS[0]; 

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % USER_COLORS.length;
  
  return USER_COLORS[index];
};