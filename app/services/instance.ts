import Cookies from 'js-cookie';
import axios, { AxiosError } from 'axios';

const instance = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(async (config) => {
  const token = Cookies.get('token') ?? 'failed_token';

  if (config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    config.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

instance.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default instance;
