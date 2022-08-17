import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import Authenticated, { AuthenticatedType } from './authenticated';

interface Admin extends AuthenticatedType {
  loading?: boolean;
  children: React.ReactNode;
}

const Admin: React.FC<Admin> = ({ loading = true, children, ...props }) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user.name.length > 0) {
      if (user.level !== 'admin') router.back();
      loading = false;
    }

    return () => {
      loading = true;
    };
  }, [user]);

  return (
    <Authenticated loading={loading} {...props}>
      {children}
    </Authenticated>
  );
};

export default Admin;
