export const parsePayload = (payload: string) => {
  try {
    return payload ? JSON.parse(payload) : payload;
  } catch (error) {
    return null;
  }
};
