import { useEffect } from 'react';
import { RootState } from '@/app/store';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

interface Guest {
  className?: string;
  alert?: React.ReactNode;
  children: React.ReactNode;
}

const Guest: React.FC<Guest> = ({ alert, className, children }) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  const checkUser = async () => {
    const { name } = user;
    if (name != '' || (name && (name as string).length > 0)) {
      router.push('/dashboard');
    }
  };

  useEffect(() => {
    checkUser();
  }, [user]);

  return (
    <main className='min-w-screen min-h-screen bg-gray-100 flex flex-col justify-center items-center'>
      <div className='w-full flex justify-center prose mb-6'>
        <h1 className='text-primary'>QUIZ APP</h1>
      </div>
      {alert}
      <div className={`${className} bg-white p-5 rounded-md w-4/12 shadow-lg`}>
        {children}
      </div>
    </main>
  );
};

export default Guest;
