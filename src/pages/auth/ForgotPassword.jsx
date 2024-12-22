import Button from '../../components/Button';
import Input from '../../components/forms/Input';
import authRequest from '../../config/requests';
import { useForm } from 'react-hook-form';
import { Result } from 'antd';
import { useState } from 'react';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const handleResetPassword = async (data) => {
    try {
      const res = await authRequest.get(`forget_password/?email=${data.email}`);
      const responseData = res.data;
      if (responseData.status === 'success') {
        toast.success(responseData.message);
        reset();
      } else {
        setError(true);
        toast.error('Mail not sent. please try again');
      }
    } catch (error) {
      console.log(error);
      setError(true);
      toast.error('An error occurred. please try again');
    } finally {
      setShowResult(true);
    }
  };

  const closeResultModal = () => {
    setShowResult(false);
    if (error) setError(false);
  };

  return (
    <div className='flex flex-col gap-6 w-full items-center relative bg-[url("../src/assets/trianglify-lowres.png")] px-2 h-screen bg-no-repeat bg-cover'>
      <h2 className='text-2xl font-semibold mb-4 self-start justify-self-start py-5 text-gray-500'>
        Forgot Password
      </h2>
      <form
        onSubmit={handleSubmit(handleResetPassword)}
        className='w-5/6 md:w-2/4 lg:w-1/4 flex flex-col bg-form px-4 py-4 rounded-md'
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
            required: '',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'enter a valid email',
            },
          }}
          placeholder={'enter your email'}
        />
        <Button
          type='submit'
          className='bg-blue-500 text-white py-2 rounded-lg w-fit self-center px-7'
        >
          Reset Password
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
            title={error ? 'Message not sent' : 'Message sent'}
            subTitle={
              error
                ? 'please try again '
                : 'please check your email for reset link'
            }
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
}

export default ForgotPassword;
