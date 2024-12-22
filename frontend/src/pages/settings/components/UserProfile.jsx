import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useApiMutation from '../../../hooks/useApiMutation';
import useAuthState from '../../../hooks/useAuth';
import { Button, Spin } from 'antd';
import Input from '../../../components/forms/Input';

const UserProfile = () => {
  const { user, setUser } = useAuthState();

  const { mutateAsync, isLoading } = useApiMutation(
    ['users', user.id],
    `users/${user.id}/`,
    'put'
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
    },
  });

  useEffect(() => {
    reset(user);
  }, [user]);

  const onSubmit = async (data) => {
    try {
      const res = await mutateAsync(data);
      if (res.status === 'success') {
        toast.success(res.message);
        setUser((prev) => ({
          ...prev,
          email: res.data.email,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
        }));
      } else {
        toast.error('An error occurred updating user profile');
      }
    } catch (error) {
      toast.error('cannot update user');
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        name='first_name'
        register={register}
        error={errors?.first_name}
        label={'first name'}
        options={{
          required: 'field cannot be empty',
        }}
        className={'input'}
      />
      <Input
        name='last_name'
        register={register}
        error={errors?.last_name}
        label={'last name'}
        options={{
          required: 'field cannot be empty',
        }}
        className={'input'}
      />
      <Input
        name='email'
        register={register}
        error={errors?.email}
        label={'email'}
        options={{
          required: 'field cannot be empty',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: 'enter a valid email',
          },
        }}
        type={'email'}
        className={'input'}
      />

      {isLoading && <Spin size='large' />}

      <Button htmlType='submit'>update</Button>
    </form>
  );
};

export default UserProfile;
