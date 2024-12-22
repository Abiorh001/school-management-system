import authRequest from '../config/requests';
const fetchUser = async (user_id) => {
  const user = await authRequest.get(`users/${user_id}/`);
  return user.data.data;
};

export default fetchUser;
