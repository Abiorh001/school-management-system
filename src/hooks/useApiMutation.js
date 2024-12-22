import authRequest from '../config/requests';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useApiMutation = (mutationKey, endpoint, method = 'post') => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data) => {
      const response = await authRequest[method](endpoint, data);
      return response.data;
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(mutationKey);
      },
    }
  );
};

export default useApiMutation;
