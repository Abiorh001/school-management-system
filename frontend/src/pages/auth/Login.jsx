import Input from '../../components/forms/Input';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import useAuthState from '../../hooks/useAuth';
import { MoonLoader } from 'react-spinners';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import authRequest from '../../config/requests';
import jwt_decode from 'jwt-decode';
import { roleUrl } from '../../consts';

const LogIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { setUser, user } = useAuthState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await authRequest.post('auth/sign_in/', data);
      const res = response.data;
      if (response?.status === 200) {
        localStorage.setItem('auth', JSON.stringify(res));
        const accessToken = jwt_decode(res.access);
        localStorage.setItem('expiry', accessToken.exp);
        const user = res.data;
        setUser(user);
        const url = roleUrl[user.role];

        toast.success('signed in!');
        navigate(`/dashboard/${url}`);
      } else {
        toast.error('Invalid Credentials!');
      }
    } catch (error) {
      toast.error('Invalid Credentials!');
      toast.error(error.detail);
    } finally {
      setIsLoading(false);
    }
  };

  if (user) return <Navigate to={`/dashboard/${user.role}`} replace />;

  return (
    <div className='flex flex-col gap-6 w-full items-center relative bg-[url("../src/assets/trianglify-lowres.png")] px-2 h-screen bg-no-repeat bg-cover'>
      <h2 className='text-2xl font-semibold mb-4 self-start justify-self-start py-5 text-gray-500'>
        Login
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${
          isLoading ? 'opacity-50' : ''
        } w-5/6 md:w-2/4 lg:w-1/4 flex flex-col bg-form px-4 py-4 rounded-md`}
      >
        <Input
          name='email'
          register={register}
          className={
            'input border w-full bg-[url("../src/assets/email.svg")] bg-no-repeat bg-pl login'
          }
          error={errors.email}
          label={'email'}
          options={{
            required: 'email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'enter a valid email',
            },
          }}
          placeholder={'enter your email'}
          type={'email'}
        />

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
          placeholder={'enter your password'}
          type={'password'}
        />
        <Link
          to={'/forgot_password'}
          className='text-red-700 py-2 text-right w-fit self-end'
        >
          forgot password?
        </Link>
        {isLoading && (
          <div className='self-center'>
            <MoonLoader color='rgb(0,82,250)' className='z-20' width={500} />
          </div>
        )}
        <Button
          type='submit'
          className='bg-header text-white capitalize w-1/2 rounded-2xl py-2 self-center btn'
        >
          login
        </Button>
      </form>
    </div>
  );
};

export default LogIn;
