export const getBaseUrl = () => {
  return process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
};
