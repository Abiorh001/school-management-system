import { useForm } from 'react-hook-form';
import Input from '../../components/forms/Input';
import useApiMutation from '../../hooks/useApiMutation';
import { toast } from 'react-toastify';
import { Button, Select } from 'antd';
import useAuthState from '../../hooks/useAuth';
import useApiQuery from '../../hooks/useApiQuery';
import { useState } from 'react';

const RegisterTeacherProfile = () => {
  const { user } = useAuthState();
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const { data: departments } = useApiQuery(['departments'], 'departments/');

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
      licence_expiry_date: '',
      licence_issue_date: '',
      license_number: '',
      department: [],
    },
  });

  const options = departments?.data.map((department) => {
    return {
      label: department.department_name,
      value: department.department_id,
    };
  });

  const { mutateAsync } = useApiMutation(['teachers'], 'teachers/');

  const onSubmit = async (data) => {
    const allData = { ...data, department: selectedDepartment };
    try {
      const res = await mutateAsync(allData);
      if (res.status === 'success') {
        toast.success(res?.message);
        reset();
        setSelectedDepartment([]);
      } else {
        toast.error('An error occurred');
      }
    } catch (error) {
      console.log(error);
      toast.error('request failed, please try again');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-col md:flex-row gap-2 items-center'>
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
        <div className='w-full'>
          <label htmlFor='department' className='capitalize'>
            department
          </label>
          <Select
            mode='multiple'
            options={options}
            value={selectedDepartment}
            onChange={(value) => {
              setSelectedDepartment(value);
            }}
            className='input'
            allowClear
            id='department'
          />
        </div>
      </div>
      <div className='flex flex-col md:flex-row gap-2'>
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
        <Input
          name={'date_of_birth'}
          label={'DOB'}
          error={errors?.date_of_birth}
          register={register}
          options={{
            required: 'date of birth is required',
          }}
          className='input'
          type={'date'}
        />
      </div>
      <div className='flex flex-col md:flex-row gap-2 items-center'>
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
        <div className='w-full'>
          <label
            htmlFor='gender'
            className='capitalize blocktext-word pb-3 w-full'
          >
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
      <div className='flex gap-2 flex-col md:flex-row'>
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

      <div className='flex flex-col md:flex-row gap-2'>
        <Input
          name={'license_number'}
          label={'license_number'}
          error={errors?.license_number}
          register={register}
          options={{
            required: 'please enter license number',
          }}
          className={'input'}
          placeholder={'license number'}
        />
        <Input
          name={'licence_expiry_date'}
          label={'licence expiry date'}
          error={errors?.licence_expiry_date}
          register={register}
          options={{
            required: 'please enter licence expiry date',
          }}
          className={'input'}
          placeholder={'licence expiry date'}
          type={'date'}
        />
        <Input
          name={'licence_issue_date'}
          label={'licence issue date'}
          error={errors?.licence_issue_date}
          register={register}
          options={{
            required: 'please enter licence issue date',
          }}
          className={'input'}
          placeholder={'licence issue date'}
          type={'date'}
        />
      </div>

      <Button htmlType='submit'>create profile</Button>
    </form>
  );
};

export default RegisterTeacherProfile;
