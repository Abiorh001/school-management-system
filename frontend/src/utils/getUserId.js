const getUserFromStorage = () => {
  const token = JSON.parse(localStorage.getItem('auth')) || null;

  const user = token?.data;

  return user ?? user;
};

export default getUserFromStorage;
