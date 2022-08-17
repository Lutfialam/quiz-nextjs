import instance from './instance';

/**
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
