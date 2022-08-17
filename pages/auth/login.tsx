import React, { useState } from 'react';

import { login } from '@/services/auth';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setUser } from '@/features/user/userSlice';

import Guest from '@/components/layouts/guest';
import Button from '@/components/atoms/button';
import Loading from '@/components/atoms/loading';
import Input from '@/components/atoms/form/input';

interface Credential {
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Credential>({
    email: '',
    password: '',
  });
  const [dataError, setDataError] = useState<Credential>({
    email: '',
    password: '',
  });

  const onInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setData({
      ...data,
      [name]: value,
    });
  };

  const isValidated = () => {
    if (data.email.length <= 0) {
      setDataError({ ...dataError, email: 'email cannot be null' });
      return false;
    }
    if (data.password.length <= 0) {
      setDataError({ ...dataError, password: 'password cannot be null' });
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (isValidated()) {
      setLoading(true);
      const result = await login(data);

      if (result.errors) {
        setDataError({ ...dataError, ...result.errors });
        setLoading(false);
      } else if (result.error) {
        setDataError({ ...dataError, [result.error]: result.message });
        setLoading(false);
      }

      if (result.access_token) {
        dispatch(setUser(result.user));
        router.push('/dashboard');
      }
      setLoading(false);
    }
  };

  return (
    <Guest className='w-full sm:w-5/12'>
      <h1 className='text-3xl mb-5'>Signin</h1>
      <form className='flex flex-col'>
        <Input
          type='email'
          name='email'
          label='Email'
          value={data.email}
          error={dataError.email}
          onChange={onInputChange}
          className='w-full p-2'
        />
        <Input
          type='password'
          name='password'
          label='Password'
          value={data.password}
          error={dataError.password}
          onChange={onInputChange}
          className='w-full p-2'
        />

        <div className='control mb-5 mt-2 p-2'>
          <label className='checkbox'>
            <input
              type='checkbox'
              name='rememberMe'
              className='rounded-md mr-2'
            />{' '}
            Remember Me
          </label>
        </div>

        <div className='w-full flex justify-end py-3'>
          <p className='text-gray-600'>
            Not have an account?{' '}
            <a href='/auth/register' className='text-indigo-500'>
              Signup
            </a>{' '}
            now
          </p>
        </div>

        <div className='flex justify-between items-center'>
          <Loading show={loading} />
          <Button title='Login' onClick={submit} disabled={loading} />
        </div>
      </form>
    </Guest>
  );
};

export default Login;
