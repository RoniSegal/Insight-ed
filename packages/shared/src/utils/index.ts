// Declare setTimeout for environments without DOM/Node types
declare function setTimeout(callback: () => void, ms: number): unknown;

// Simple utility functions
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const generateId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${timestamp}-${random}`;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
