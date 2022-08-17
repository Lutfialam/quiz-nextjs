import { CreateUser } from '@/model/user';
import instance from './instance';

export const toUserFormData = (user: CreateUser) => {
  const form = new FormData();

  form.append('name', user.name);
  form.append('email', user.email);
  form.append('password', user.password);
  form.append('password_confirmation', user.passwordConfirmation);

  if (user.level) form.append('level', user.level);
  if (user.image) form.append('image', user.image);

  return form;
};

/**
 * Is used to get list of user
 *
 * @param signal is the abort signal
 * @param search is the parameter for searching data;
 * @param page is the parameter for pagination page
 */
export const getUserlist = async (
  signal: AbortSignal,
  search?: string,
  page?: number
) => {
  const searchParam = search ? `&search=${search}` : '';
  const url = `/api/user?page=${page ?? 1}${searchParam}`;

  const { data } = await instance.get(url, { signal });
  return data;
};

/**
 * Is used to creating new user
 *
 * @param user is the user data that want to create
 */
export const createUser = async (user: CreateUser) => {
  let data: any = {};

  const form = toUserFormData(user);
  instance.defaults.headers.common['Content-Type'] = 'multipart/form-data';

  await instance
    .post('/api/user', { form })
    .then((response) => (data = response.data))
    .catch((error) => (data = error.response.data));

  return data;
};
