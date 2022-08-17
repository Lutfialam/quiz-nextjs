import instance from './instance';

export const getCategory = async (
  signal: AbortSignal,
  search?: string,
  page?: number
) => {
  const url =
    search && search.length > 0
      ? `/api/category?page=${page ?? 1}&search=${search}`
      : `/api/category?page=${page ?? 1}`;

  const { data } = await instance.get(url, { signal });
  return data;
};

export const getCategoryById = async (id: number) => {
  const { data } = await instance.get(`/api/category/${id}`);
  return data;
};

export const createCategory = async (category: any) => {
  let data: any = {};
  await instance
    .post('/api/category', category)
    .then((response) => (data = response.data))
    .catch((error) => (data = error.response.data));

  return data;
};

export const updateCategory = async (category: any) => {
  let data: any = {};
  await instance
    .put(`/api/category/${category.id}`, category)
    .then((response) => (data = response.data))
    .catch((error) => (data = error.response.data));

  return data;
};

export const deleteCategory = async (id: number) => {
  let data: any = {};
  await instance
    .delete(`/api/category/${id}`)
    .then((response) => (data = response.data))
    .catch((error) => (data = error.response.data));

  return data;
};
