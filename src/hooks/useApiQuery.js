import authRequest from '../config/requests';
import { useQuery } from '@tanstack/react-query';
import getNewToken from '../utils/getNewToken';

const useApiQuery = (queryKey, endpoint) => {
  const results = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await authRequest.get(endpoint);
      return response?.data;
    },
    onError: async (err) => {
      const code = err?.response?.data;
      if (code && code?.code === 'token_not_valid') {
        await getNewToken();
        return;
      }
      return err;
    },
  });
  return results;
};

export default useApiQuery;
