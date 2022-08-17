import { CreateHistoryType } from '@/model/history';
import instance from './instance';

export const getHistory = async () => {
  const { data } = await instance.get(`/api/history`);
  return data;
};

export const getHistoryResult = async (id: number) => {
  const { data } = await instance.get(`/api/history/${id}`);
  return data;
};

export const addHistory = async (history: CreateHistoryType) => {
  const { data } = await instance.post('/api/history', history);
  return data;
};
