import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import PropTypes from 'prop-types';

const RequireAuth = ({ allowedRoles }) => {
  const { user } = useAuth();

  const location = useLocation();
  return allowedRoles.includes(user?.role.toLowerCase()) ? (
    <Outlet />
  ) : user ? (
    <Navigate to={'/unauthorized'} state={{ from: location }} replace />
  ) : (
    <Navigate to={'/login'} state={{ from: location }} replace />
  );
};

RequireAuth.propTypes = {
  allowedRoles: PropTypes.array,
};

export default RequireAuth;
