import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import authRequest from '../../config/requests';
import Input from '../../components/forms/Input';
import Button from '../../components/Button';
import { Result, Spin } from 'antd';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();

  const id = searchParams.get('user_id');
  const token = searchParams.get('token');
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: '',
      confirm_password: '',
    },
  });

  const handleResetPassword = async (data) => {
    setIsSending(true);
    try {
      const res = await authRequest.put(
        `reset_password/?user_id=${id}&token=${token}`,
        { password: data.password }
      );
      const responseData = res.data;
      if (responseData.status === 'success') {
        toast.success(responseData.message);
        reset();
      } else {
        setError(true);
        toast.error('failed to reset passord');
      }
    } catch (error) {
      console.log(error);
      setError(true);
      toast.error('An error occurred. please try again');
    } finally {
      setShowResult(true);
      setIsSending(false);
    }
  };

  const closeResultModal = () => {
    setShowResult(false);
    if (error) setError(false);
  };

  return (
    <div className='flex flex-col gap-6 w-full items-center relative bg-[url("../src/assets/trianglify-lowres.png")] px-2 h-screen bg-no-repeat bg-cover'>
      <h2 className='text-2xl font-semibold mb-4 self-start justify-self-start py-5 text-gray-500'>
        Password Reset
      </h2>
      <form
        onSubmit={handleSubmit(handleResetPassword)}
        className='w-5/6 md:w-2/4 lg:w-1/4 flex flex-col bg-form px-4 py-4 rounded-md'
      >
        <Input
          name='password'
          register={register}
          className={
            'input bg-[url("../src/assets/lock.svg")] bg-no-repeat bg-pl login'
          }
          error={errors.password}
          label={'new password'}
          options={{
            required: 'password cannot be empty',
          }}
          placeholder={'enter your new password'}
          type={'password'}
        />
        <Input
          name='confirm_password'
          register={register}
          className={'input'}
          error={errors?.confirm_password}
          label={'confirm password'}
          options={{
            required: 'please retype password',
            validate: (val) => {
              if (watch('password') !== val) {
                return 'passwords do not match';
              }
            },
          }}
          placeholder={'*******'}
          type='password'
        />
        {isSending && <Spin size='large' />}
        <Button
          type='submit'
          className='bg-blue-500 text-white py-2 rounded-lg w-fit self-center px-7 capitalize'
        >
          new password
        </Button>
      </form>

      {showResult && (
        <>
          <div
            className='z-10 fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50'
            onClick={closeResultModal}
          ></div>
          <Result
            className='absolute top-1/2 -translate-y-1/2 z-20 bg-white rounded-md'
            status={error ? 'error' : 'success'}
            title={error ? 'Passord rest failed' : 'Passord reset successfully'}
            extra={[
              <Button
                key={'okay'}
                onClick={closeResultModal}
                className={'border px-4 text-xl rounded-lg py-1 capitalize'}
              >
                ok
              </Button>,
            ]}
          />
        </>
      )}
    </div>
  );
};

export default ResetPassword;
