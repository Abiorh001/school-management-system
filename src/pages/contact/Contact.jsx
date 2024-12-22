import { useForm } from 'react-hook-form';
import contact from '../../assets/contact-us.png';
import { useState } from 'react';
import { Button, Spin } from 'antd';
import Input from '../../components/forms/Input';
import { toast } from 'react-toastify';

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      full_name: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        toast.success('message sent');
        setIsLoading(false);
        reset();
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main className='flex flex-col px-5 md:px-12 py-3 md:py-5'>
      <h1 className='text-4xl font-bold text-gray-800 mb-4'>Contact Us</h1>
      <p className='leading-7 tracking-wider md:max-w-lg'>
        {' '}
        Have questions or need assistance with our Education Management System?
        We&#39;re here to help!
      </p>
      <div className='flex flex-col-reverse md:flex-row-reverse justify-between md:gap-10 pt-7 md:pt-16 gap-12'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`${
            isLoading && 'opacity-50'
          } md:w-1/2 md:max-w-lg border px-3 py-4 rounded-md bg-gray-100`}
        >
          <Input
            name='full_name'
            register={register}
            className={'input'}
            error={errors.full_name}
            label={'full_name'}
            options={{
              required: 'please provide your full name',
            }}
            placeholder={'John Smith'}
          />

          <Input
            name='email'
            register={register}
            className={'input'}
            error={errors.email}
            label={'email'}
            options={{
              required: 'email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'enter a valid email',
              },
            }}
            placeholder={'user@example.com'}
            type={'email'}
          />

          <div>
            <label
              htmlFor='message'
              className='block capitalize text-lg text-word pb-3 w-full'
            >
              message
            </label>
            <textarea
              id='message'
              cols='30'
              rows='5'
              {...register('message', {
                required: 'this field is required',
              })}
              placeholder='Hello, I would love to make use of your school management system...'
              className='input'
            ></textarea>
            {errors?.message && (
              <p className='text-sm text-red-500'>{errors?.message?.message}</p>
            )}
          </div>

          {isLoading && <Spin size='large' className='block' />}
          <Button
            htmlType='submit'
            className='capitalize px-7 mt-4 bg-header text-white'
            size='large'
          >
            send
          </Button>
        </form>
        <div className='md:w-1/2'>
          <img src={contact} alt='' className='object-cover' />
        </div>
      </div>
    </main>
  );
};

export default Contact;
