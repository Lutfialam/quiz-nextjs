import Admin from '@/components/layouts/admin';
import Button from '@/components/atoms/button';
import Input from '@/components/atoms/form/input';
import TextArea from '@/components/atoms/form/textArea';
import CategoryType, { CategoryErrorType } from '@/model/category';
import { ChangeEvent, useState } from 'react';
import { createCategory } from '@/services/category';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setAlert } from '@/features/alert/alertSlice';

interface Create {}

const Create: React.FC<Create> = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<CategoryType>({
    name: '',
    description: '',
  });
  const [categoryError, setCategoryError] = useState<CategoryErrorType>({});

  const onChange = (e: ChangeEvent) => {
    const { name, value } = e.currentTarget as HTMLInputElement;
    setCategory({ ...category, [name]: value });
  };

  const submit = async () => {
    if (category.name && category.name?.length > 0) {
      setLoading(true);
      const result = await createCategory(category);

      if (result.errors) {
        setCategoryError({ ...categoryError, ...result.errors });
        setLoading(false);
      } else if (result.error) {
        setCategoryError({ ...categoryError, [result.error]: result.message });
        setLoading(false);
      }

      if (result.status == 'success') {
        dispatch(
          setAlert({
            status: 'success',
            message: 'Category created successfully',
          })
        );
        router.push('/category');
      }
      setLoading(false);
    } else {
      setCategoryError({ ...categoryError, name: 'Name is required' });
    }
  };

  return (
    <Admin loading={loading}>
      <div className='flex bg-white flex-col sm:p-5'>
        <div className='w-full flex justify-between items-center mb-5'>
          <h1 className='text-2xl font-bold text-gray-500'>
            Create new Category
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
          <Button title='submit data' onClick={submit} />
        </div>
      </div>
    </Admin>
  );
};

export default Create;
