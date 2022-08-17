import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setAlert } from '@/features/alert/alertSlice';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import CategoryType, { CategoryErrorType } from '@/model/category';
import { getCategoryById, updateCategory } from '@/services/category';

import Button from '@/components/atoms/button';
import Admin from '@/components/layouts/admin';
import Input from '@/components/atoms/form/input';
import TextArea from '@/components/atoms/form/textArea';

interface Edit {}

const Edit: React.FC<Edit> = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const isMounted = useRef(false);

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<CategoryType>({});
  const [categoryError, setCategoryError] = useState<CategoryErrorType>({});

  const getData = async () => {
    isMounted.current = true;
    const result = await getCategoryById(parseInt(id as string));

    setCategory(result);
    setLoading(false);
  };

  const onChange = (e: ChangeEvent) => {
    const { name, value } = e.currentTarget as HTMLInputElement;
    setCategory({ ...category, [name]: value });
  };

  const submit = async () => {
    if (category.name && category.name?.length > 0) {
      setLoading(true);
      const result = await updateCategory(category);

      if (result.errors) {
        setCategoryError({ ...categoryError, ...result.errors });
      } else if (result.error) {
        setCategoryError({ ...categoryError, [result.error]: result.message });
      }

      if (result.status == 'success') {
        dispatch(
          setAlert({
            status: 'success',
            message: 'Category updated successfully',
          })
        );
        router.push('/category');
      }
      setLoading(false);
    } else {
      setCategoryError({ ...categoryError, name: 'Name is required' });
    }
  };

  useEffect(() => {
    if (isMounted.current) return;
    if (id) getData();
  }, [id]);

  return (
    <Admin loading={loading}>
      <div className='flex bg-white flex-col sm:p-5'>
        <div className='w-full flex justify-between items-center mb-5'>
          <h1 className='text-2xl font-bold text-gray-500'>
            Edit category {category.name}
          </h1>
        </div>

        <div className='w-full'>
          <div className='w-full flex my-1'>
            <Input
              name='name'
              label='Category name'
              className='w-full p-2'
              value={category.name}
              error={categoryError.name}
              onChange={onChange}
            />
          </div>
          <div className='w-full flex items-end'>
            <TextArea
              required={false}
              name='description'
              label='Description'
              className='px-2 w-full'
              value={category.description}
              error={categoryError.description}
              onChange={onChange}
            />
          </div>
        </div>

        <div className='w-full flex justify-end mt-4'>
          <Button title='Update data' onClick={submit} />
        </div>
      </div>
    </Admin>
  );
};

export default Edit;
