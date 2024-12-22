import { Outlet, Navigate } from 'react-router-dom';
import Header from '../headers/root/Header';
import useAuthState from '../../hooks/useAuth';

const RootLayout = () => {
  const date = new Date();
  const { user } = useAuthState();

  if (user) return <Navigate to={`/dashboard/${user.role}`} replace />;

  return (
    <>
      <Header />
      <Outlet />
      <footer className='bg-white text-center py-4'>
        <p>&copy; {date.getFullYear()} smartEdConnect. All rights reserved</p>
      </footer>
    </>
  );
};

export default RootLayout;
