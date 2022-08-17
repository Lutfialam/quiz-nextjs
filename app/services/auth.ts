import Cookies from 'js-cookie';
import instance from '@/services/instance';
import { RegisterUser } from '@/model/user';

export const login = async (user: { email: string; password: string }) => {
  let data: any = {};
  await instance.get(`/sanctum/csrf-cookie`).then(async (res) => {
    await instance
      .post('/api/auth/login', { ...user })
      .then((response) => (data = response.data))
      .catch((error) => (data = error.response.data));

    if (data.access_token) Cookies.set('token', data.access_token);
  });
  return data;
};

export const register = async (user: RegisterUser) => {
  let data: any = {};
  const form = new FormData();

  form.append('name', user.name);
  form.append('email', user.email);
  form.append('password', user.password);
  form.append('password_confirmation', user.passwordConfirmation);
  if (user.image) form.append('image', user.image);

  await instance
    .post('/api/auth/register', form)
    .then((response) => (data = response.data))
    .catch((error) => (data = error.response.data));

  return data;
};

export const getUser = async (signal: AbortSignal) => {
  return await instance.get(`/api/auth/user`, { signal });
};

export const logout = async () => {
  await instance.get('/api/auth/logout');
  Cookies.remove('token');
};
