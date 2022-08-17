import instance from './instance';

export const getCountData = async (signal: AbortSignal) => {
  return await instance.get('/api/get-count-data', { signal });
};
