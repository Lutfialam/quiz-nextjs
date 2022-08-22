import { useState } from 'react';
import { useRouter } from 'next/router';
import { register } from '@/services/auth';
import { CreateUser, UserErrorType } from '@/model/user';

import Guest from '@/components/layouts/guest';
import Button from '@/components/atoms/button';
import Input from '@/components/atoms/form/input';
import { FileInput, Label } from 'flowbite-react';
import Link from 'next/link';

interface Register {}

const Register: React.FC<Register> = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CreateUser>({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    image: null,
  });
  const [dataError, setDataError] = useState<UserErrorType>({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    image: '',
  });

  const onInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      setData({
        ...data,
        image: e.currentTarget.files[0],
      });
    }
    const { name, value } = e.currentTarget;
    setData({
      ...data,
      [name]: value,
    });
  };

  const isValidated = () => {
    const list = ['name', 'email', 'password', 'passwordConfirmation'] as const;

    let isValid = true;
    list.map((key) => {
      if (data[key].length <= 0) {
        isValid = false;
        setDataError({ ...dataError, [key]: `${key} cannot be null` });
      }
      if (key === 'passwordConfirmation' && data[key] !== data.password) {
        isValid = false;
        setDataError({ ...dataError, [key]: `${key} must be same` });
      }
    });

    return isValid;
  };

  const submit = async () => {
    if (isValidated()) {
      setLoading(true);
      const result = await register(data);

      if (result.user) router.push('/auth/login');

      if (result.errors) {
        setDataError({ ...dataError, ...result.errors });
        setLoading(false);
      } else {
        console.log('====================================');
        console.log(result);
        console.log('====================================');
      }
    }
  };

  return (
    <Guest className='w-full sm:w-8/12 p-10 sm:p-5 shadow-lg'>
      <h1 className='text-3xl mb-5 text-left'>Register</h1>
      <form className='flex flex-col sm:flex-row flex-wrap justify-end'>
        <Input
          name='name'
          label='Name'
          className='w-full sm:w-6/12 p-2'
          autoFocus={true}
          value={data.name}
          error={dataError.name}
          onChange={onInputChange}
        />
        <Input
          type='email'
          name='email'
          label='Email'
          className='w-full sm:w-6/12 p-2'
          value={data.email}
          error={dataError.email}
          onChange={onInputChange}
        />
        <Input
          type='password'
          name='password'
          label='Password'
          className='w-full sm:w-6/12 p-2'
          value={data.password}
          error={dataError.password}
          onChange={onInputChange}
        />
        <Input
          type='password'
          name='passwordConfirmation'
          label='Repeat password'
          className='w-full sm:w-6/12 p-2'
          value={data.passwordConfirmation}
          error={dataError.passwordConfirmation}
          onChange={onInputChange}
        />
        <div id='fileUpload' className='my-3 w-full p-2'>
          <div className='mb-2 block'>
            <Label htmlFor='file' value='Upload file' />
          </div>
          <FileInput
            id='file'
            onChange={onInputChange}
            helperText='Upload profile picture for your account'
          />
        </div>
        {/* <input type='file' name='image' onChange={onInputChange} /> */}

        <div className='w-full flex justify-end py-3'>
          <p className='text-gray-600'>
            Already have an account?{' '}
            <Link href='/auth/login'>
              <span className='text-indigo-500'>Login</span>
            </Link>{' '}
            now.
          </p>
        </div>

        <Button title='Register' onClick={submit} disabled={loading} />
      </form>
    </Guest>
  );
};

export default Register;
