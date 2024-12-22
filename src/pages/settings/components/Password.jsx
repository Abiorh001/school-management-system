import { useForm } from 'react-hook-form';
import Input from '../../../components/forms/Input';
import useApiMutation from '../../../hooks/useApiMutation';
import useAuthState from '../../../hooks/useAuth';
import { Button } from 'antd';
import { toast } from 'react-toastify';

const Password = () => {
  const { user } = useAuthState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      role_id: user.role_id,
      school_id: user?.school_id,
      email: user.email,
      password: '',
    },
  });

  const { mutateAsync, error: passwordError } = useApiMutation(
    ['password'],
    `reset_password/`,
    'put'
  );

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const res = await mutateAsync(data);
      console.log(res);
      if (res.status === 'success') {
        toast.success(res.message);
        reset();
      } else {
        console.log(passwordError);
        toast.error('An error occurred updating user password');
      }
    } catch (error) {
      toast.error('cannot update password');
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        name='password'
        register={register}
        className={
          'input bg-[url("../src/assets/lock.svg")] bg-no-repeat bg-pl login'
        }
        error={errors.password}
        label={'password'}
        options={{
          required: 'please input your password',
        }}
        placeholder={'enter new password'}
        type={'password'}
      />

      <Button htmlType='submit'>change</Button>
    </form>
  );
};

export default Password;
