export const getPayload = (fileId: string) => {
  try {
    return fileId ? JSON.parse(fileId) : fileId;
  } catch (error) {
    return null;
  }
};
