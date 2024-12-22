import { useForm } from 'react-hook-form';
import Input from '../../components/forms/Input';
import useApiMutation from '../../hooks/useApiMutation';
import { toast } from 'react-toastify';
import { Button } from 'antd';
import useAuthState from '../../hooks/useAuth';

const RegisterStudentProfile = () => {
  const { user } = useAuthState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      phone_number: '',
      date_of_birth: '',
      gender: '',
      street_address: '',
      city: '',
      state: '',
      country: '',
      school_id: user?.school_id,
      user_id: '',
      department_id: '',
    },
  });

  const { mutateAsync, error } = useApiMutation(['students'], 'students/');

  const onSubmit = async (data) => {
    try {
      const res = await mutateAsync(data);
      if (res.status === 'success') {
        toast.success(res?.message);
        reset();
      } else {
        toast.error('An error occurred');
      }
    } catch (err) {
      console.log(error);
      toast.error('request failed, please try again');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Input
          name={'user_id'}
          label={'user id'}
          error={errors?.user_id}
          register={register}
          options={{
            required: 'please enter user id',
          }}
          className='input'
          placeholder={'user id'}
        />
        <Input
          name={'department_id'}
          label={'department id'}
          error={errors?.department_id}
          register={register}
          options={{
            required: 'please enter department id',
          }}
          className='input'
          placeholder={'department id'}
        />
      </div>
      <Input
        name={'phone_number'}
        label={'phone number'}
        error={errors?.phone_number}
        register={register}
        options={{
          required: 'please enter phone number',
        }}
        className='input'
        placeholder={'phone number'}
      />
      <div className='flex flex-col md:flex-row gap-2'>
        <Input
          name={'date_of_birth'}
          label={'DOB'}
          error={errors?.date_of_birth}
          register={register}
          options={{
            required: 'date of birth is required',
          }}
          className='w-fit px-2 ml-3'
          type={'date'}
        />
        <div className='flex items-center gap-3'>
          <label htmlFor='gender' className='capitalize'>
            gender
          </label>
          <select
            id='gender'
            {...register('gender', {
              required: 'please select one',
            })}
            className='input'
          >
            <option value=''></option>
            <option value='male'>male</option>
            <option value='female'>female</option>
            <option value='other'>other</option>
          </select>

          {errors?.gender && (
            <p className='text-red-500 text-xs pt-1 normal-case italic'>
              {errors.gender.message}
            </p>
          )}
        </div>
      </div>

      <Input
        name={'street_address'}
        label={'street address'}
        error={errors?.street_address}
        register={register}
        options={{
          required: 'please enter street address',
        }}
        className={'input'}
        placeholder={'street address'}
      />
      <div className='flex gap-2'>
        <Input
          name={'city'}
          label={'city'}
          error={errors?.city}
          register={register}
          options={{
            required: 'please enter city',
          }}
          className={'input'}
          placeholder={'city'}
        />

        <Input
          name={'state'}
          label={'state'}
          error={errors?.state}
          register={register}
          options={{
            required: 'please enter state',
          }}
          className={'input'}
          placeholder={'lagos,delta,kano'}
        />

        <Input
          name={'country'}
          label={'country'}
          error={errors?.country}
          register={register}
          options={{
            required: 'please enter country',
          }}
          className={'input'}
          placeholder={'Nigeria, Ghana,...'}
        />
      </div>

      <Button htmlType='submit'>create profile</Button>
    </form>
  );
};

export default RegisterStudentProfile;
