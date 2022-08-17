import Link from 'next/link';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { LogoutIcon, UserIcon } from '@heroicons/react/solid';

import { RootState } from '@/app/store';
import { logout } from '@/services/auth';
import { removeUser } from '@/features/user/userSlice';

import Dropdown from '@/components/atoms/dropdown';
import NavLink from '@/components/atoms/navigation/navLink';
import ResponsiveNavLink from '@/components/atoms/navigation/responsiveNavLink';

interface NavBar {
  show?: boolean;
}

const NavBar: React.FC<NavBar> = ({ show = true }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const [showingNav, setShowingNav] = useState(false);

  const logoutConfirmation = () => {
    Swal.fire({
      title: 'Are you sure to logout?',
      text: 'You will exit from the application',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#6366f1',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logout();
        dispatch(removeUser());
        router.push('/auth/login');
      }
    });
  };

  const active = (path: string): boolean => {
    const { pathname } = router;
    if (path == '/quiz') {
      return pathname.includes('/quiz') && !pathname.includes('history')
        ? true
        : false;
    }
    return pathname.includes(path) ? true : false;
  };

  return (
    <nav className={`${!show && 'hidden'} bg-white border-b border-gray-100`}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <div className='shrink-0 flex items-center'>
              <Link href='/'>
                <h1 className='text-indigo-500 font-semibold'>Quiz App</h1>
              </Link>
            </div>

            <div className='hidden space-x-8 sm:-my-px sm:ml-10 sm:flex'>
              <NavLink href='/dashboard' active={active('/dashboard')}>
                Dashboard
              </NavLink>
              <NavLink href='/quiz' active={active('/quiz')}>
                Quiz
              </NavLink>
              <NavLink href='/quiz/history' active={active('/quiz/history')}>
                Quiz history
              </NavLink>
              {user.level == 'admin' && (
                <>
                  <NavLink href='/category' active={active('/category')}>
                    Category
                  </NavLink>
                  <NavLink href='/user' active={active('/user')}>
                    User
                  </NavLink>
                </>
              )}
            </div>
          </div>

          <div className='hidden sm:flex sm:items-center sm:ml-6'>
            <div className='ml-3 relative'>
              <Dropdown type='transparent' name={user.name ?? ''}>
                <Dropdown.MenuLink to={`/user/${user.id}`}>
                  {(active) => (
                    <>
                      <UserIcon
                        className={`mr-2 h-5 w-5 ${
                          active ? 'hover:text-white' : 'text-primary'
                        }`}
                      />
                      Profile
                    </>
                  )}
                </Dropdown.MenuLink>
                <Dropdown.MenuClick
                  activeColor='bg-red-500 text-white'
                  onClick={logoutConfirmation}
                >
                  {(active) => (
                    <>
                      <LogoutIcon
                        className={`mr-2 h-5 w-5 ${
                          active ? 'hover:text-white' : 'text-red-400'
                        }`}
                      />
                      Logout
                    </>
                  )}
                </Dropdown.MenuClick>
              </Dropdown>
            </div>
          </div>

          <div className='-mr-2 flex items-center sm:hidden'>
            <button
              onClick={() => setShowingNav((previousState) => !previousState)}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out'
            >
              <svg
                className='h-6 w-6'
                stroke='currentColor'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  className={!showingNav ? 'inline-flex' : 'hidden'}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h16M4 18h16'
                />
                <path
                  className={showingNav ? 'inline-flex' : 'hidden'}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={
          (showingNav ? 'block' : 'hidden') +
          ' sm:hidden shadow-lg rounded-b-lg'
        }
      >
        <div className='flex px-4 flex-col pt-2 pb-3 space-y-3'>
          <ResponsiveNavLink href='/dashboard' active={active('/dashboard')}>
            Dashboard
          </ResponsiveNavLink>
          <ResponsiveNavLink href='/quiz' active={active('/quiz')}>
            Quiz
          </ResponsiveNavLink>
          <ResponsiveNavLink
            href='/quiz/history'
            active={active('/quiz/history')}
          >
            Quiz history
          </ResponsiveNavLink>
          {user.level == 'admin' && (
            <>
              <ResponsiveNavLink href='/category' active={active('/category')}>
                Category
              </ResponsiveNavLink>
              <ResponsiveNavLink href='/user' active={active('/user')}>
                User
              </ResponsiveNavLink>
            </>
          )}
        </div>

        <div className='pt-4 pb-1 border-t border-gray-200'>
          <div className='px-4'>
            <div className='font-medium text-base text-gray-800'>
              {user.name ?? ''}
            </div>
            <div className='font-medium text-sm text-gray-500'>
              {user.email ?? ''}
            </div>
          </div>

          <div className=' text-red-500 px-4 py-4' onClick={logoutConfirmation}>
            Logout
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
