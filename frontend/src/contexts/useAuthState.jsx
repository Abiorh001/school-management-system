import PropTypes from 'prop-types';
import { createContext, useState } from 'react';
import getUserFromStorage from '../utils/getUserId';

const AuthContext = createContext(null);

const initialState = getUserFromStorage();

export const AuthStateProvider = ({ children }) => {
  const [user, setUser] = useState(initialState);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthStateProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthContext;
