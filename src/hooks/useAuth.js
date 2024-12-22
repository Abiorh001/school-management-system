import { useContext } from 'react';
import AuthContext from '../contexts/useAuthState';

const useAuthState = () => useContext(AuthContext);

export default useAuthState;
