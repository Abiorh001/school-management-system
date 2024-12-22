import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authRequest from '../../config/requests';
import { Result, Spin } from 'antd';

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate('');
  const id = searchParams.get('user_id');
  const token = searchParams.get('token');
  const [error, setError] = useState(false);
  const [isSending, setIsSending] = useState(true);

  useEffect(() => {
    handleEmailConfirm();
  }, []);

  const handleEmailConfirm = async () => {
    setIsSending(true);
    setError(false);
    try {
      const res = await authRequest.get(
        `confirm_email/?user_id=${id}&token=${token}`
      );
      const responseData = res.data;
      if (responseData.status === 'success') {
        toast.success(responseData.message);
      } else {
        setError(true);
        toast.error('failed to confirm email');
      }
    } catch (error) {
      console.log(error);
      setError(true);
      toast.error('An error occurred. please try again');
    } finally {
      setIsSending(false);
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    }
  };

  return (
    <div className='flex flex-col gap-6 w-full items-center relative bg-[url("../src/assets/trianglify-lowres.png")] px-2 h-screen bg-no-repeat bg-cover'>
      <h2 className='text-2xl font-semibold mb-4 self-start justify-self-start py-5 text-gray-500'>
        Confirm Email
      </h2>
      <div>
        {isSending ? (
          <Spin size='large' />
        ) : (
          <Result
            className='bg-white rounded-md'
            status={error ? 'error' : 'success'}
            title={error ? 'Email not confirmed' : 'Email confirmed'}
          />
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;
