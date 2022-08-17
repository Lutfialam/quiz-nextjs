import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { RootState } from '@/app/store';
import { getUser } from '@/services/auth';
import Alert, { AlertType } from '../atoms/alert';
import { setUser } from '@/features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { removeAlert } from '@/features/alert/alertSlice';

import Image from 'next/image';
import Cookies from 'js-cookie';
import Loading from '@/components/atoms/loading';
import NavBar from '@/components/molecules/navBar';
import undrawLoading from '@/public/images/undraw_loading.svg';

export interface AuthenticatedType {
  header?: string;
  loading?: boolean;
  alert?: AlertType;
  children: React.ReactNode;
}

const Authenticated: React.FC<AuthenticatedType> = ({
  alert,
  header,
  loading = false,
  children,
}) => {
  const [showNavbar, setShowNavbar] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { alert: notif } = useSelector((state: RootState) => state);

  const checkUser = async (signal: AbortSignal) => {
    if (user.name == '' || (user.name && user.name?.length <= 0)) {
      const result = await getUser(signal).catch((err) => {
        if (err.response?.status === 401) {
          Cookies.remove('token');
          router.push('/auth/login');
        }
      });

      dispatch(setUser(result?.data));
    }
    setShowNavbar(true);
  };

  useEffect(() => {
    const controller = new AbortController();
    checkUser(controller.signal);

    if (notif?.message && notif.message.length > 0) {
      setTimeout(() => {
        dispatch(removeAlert());
      }, 4000);
    }

    return () => {
      controller.abort();
    };
  }, [notif]);

  return (
    <div className='min-h-screen bg-gray-100'>
      <NavBar show={showNavbar} />
      {header && (
        <header className='bg-white shadow'>
          <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
            {header}
          </div>
        </header>
      )}

      <main>
        <div className='sm:p-6 lg:p-8'>
          {alert && <Alert status={alert.status} message={alert.message} />}
          {notif && <Alert status={notif.status} message={notif.message} />}
          <div className='bg-white rounded-md p-5'>
            {loading ? (
              <div className='w-full flex flex-col'>
                <div className='w-full h-full flex flex-col-reverse sm:flex-row justify-between items-center py-20 px-10'>
                  <div className='w-full sm:w-4/12 prose'>
                    <h1 className='text-indigo-500 hidden sm:flex font-semibold'>
                      QUIZ APP
                    </h1>
                    <p id='loading_description'>
                      Wait for a moment. we are trying to proccess your request.
                      try refresh the page if you think is take a long time and
                      try to check internet connection
                    </p>
                    <h3 className='flex'>
                      <Loading show={true} />
                      <span className='ml-3 text-primary'>Loading ...</span>
                    </h3>
                  </div>
                  <div className='w-full sm:w-6/12'>
                    <Image src={undrawLoading} />
                  </div>
                </div>
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Authenticated;
