export const generateId = (): string => {
  return 'CT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
};