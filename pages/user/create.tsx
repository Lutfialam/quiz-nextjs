import Admin from '@/components/layouts/admin';
import Button from '@/components/atoms/button';
import Input from '@/components/atoms/form/input';

import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { ChangeEvent, useState } from 'react';
import { setAlert } from '@/features/alert/alertSlice';
import { CreateUser, UserErrorType } from '@/model/user';
import { createUser } from '@/services/user';
import Select from '@/components/atoms/form/select';
import { FileInput, Label } from 'flowbite-react';
import ImagePicker from '@/components/atoms/imagePicker';

interface Create {}

const Create: React.FC<Create> = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<CreateUser>({
    name: '',
    email: '',
    level: 'user',
    password: '',
    passwordConfirmation: '',
    image: null,
  });
  const [userError, setUserError] = useState<UserErrorType>({});

  const onChange = (e: ChangeEvent) => {
    const { name, value, files } = e.currentTarget as HTMLInputElement;
    setUser({ ...user, [name]: files ? files[0] : value });
  };

  const isValidated = () => {
    let isValid = true;
    const list = ['name', 'email', 'password', 'passwordConfirmation'] as const;

    let newError = {};
    list.map((key) => {
      if (user[key].length <= 0) {
        isValid = false;
        newError = { ...newError, [key]: `${key} cannot be null` };
      }
      if (key === 'passwordConfirmation' && user[key] !== user.password) {
        isValid = false;
        newError = { ...newError, [key]: `${key} must be same` };
      }
    });

    setUserError(newError);
    return isValid;
  };

  const submit = async () => {
    if (isValidated()) {
      setLoading(true);
      const result = await createUser(user);

      if (result.errors) {
        setUserError({ ...userError, ...result.errors });
        setLoading(false);
      }

      if (result.status == 'success') {
        dispatch(
          setAlert({
            status: 'success',
            message: 'Category created successfully',
          })
        );
        router.push('/user');
      }
      setLoading(false);
    }
  };

  return (
    <Admin loading={loading}>
      <div className='flex bg-white flex-col sm:p-5'>
        <div className='w-full flex justify-between items-center mb-5'>
          <h1 className='text-2xl font-bold text-gray-500'>Create new User</h1>
        </div>

        <div className='w-full'>
          <div className='w-full flex flex-wrap'>
            <Input
              name='name'
              label='User name'
              className='w-6/12 p-2'
              value={user.name}
              error={userError.name}
              onChange={onChange}
            />

            <Input
              type='email'
              name='email'
              label='User email'
              className='w-6/12 p-2'
              value={user.email}
              error={userError.email}
              onChange={onChange}
            />

            <Input
              type='password'
              name='password'
              label='User password'
              className='w-6/12 p-2'
              value={user.password}
              error={userError.password}
              onChange={onChange}
            />

            <Input
              type='password'
              name='passwordConfirmation'
              label='Repeat password'
              className='w-6/12 p-2'
              value={user.passwordConfirmation}
              error={userError.passwordConfirmation}
              onChange={onChange}
            />

            <Select
              label='Select level'
              name='level'
              value='user'
              className='w-6/12 p-2'
              option={['user', 'admin']}
              onChange={onChange}
            />

            <div className='w-full p-2'>
              <label className='text-gray-600'>Upload user photo</label>
              <ImagePicker onImageChange={onChange} />
            </div>
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
