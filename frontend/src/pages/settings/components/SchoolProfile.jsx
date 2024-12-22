import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Button, Spin } from 'antd';
import Input from '../../../components/forms/Input';
import useApiMutation from '../../../hooks/useApiMutation';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const SchoolProfile = ({ school }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      school_name: school?.school_name,
      school_address: school?.school_address,
      school_email: school?.school_email,
      school_phone_number: school?.school_phone_number,
      school_city: school?.school_city,
      school_country: school?.school_country,
      school_state: school?.school_state,
      school_postal_code: school?.school_postal_code,
      school_licence_number: school?.school_licence_number,
    },
  });

  const { mutateAsync, isLoading } = useApiMutation(
    'school',
    `schools/${school?.school_id}/`,
    'put'
  );

  const onSubmit = async (data) => {
    try {
      const res = await mutateAsync(data);
      console.log(res);
      if (res.status === 'success') {
        toast.success(res.message);
      } else {
        toast.error('An error occurred updating school');
      }
    } catch (error) {
      toast.error('cannot update school');
      console.log(error);
    }
  };

  useEffect(() => {
    reset(school);
  }, [school]);

  if (!school) return <Spin size='large' />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
      <div className={'md:flex gap-3 w-full'}>
        <Input
          name='school_name'
          register={register}
          className={'input'}
          error={errors?.school_name}
          label={'school name'}
          options={{
            required: 'please provide school name',
          }}
          placeholder={'enter name of school'}
        />

        <Input
          name='school_email'
          register={register}
          className={'border input'}
          error={errors?.school_email}
          label={'email'}
          options={{
            required: '',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'enter a valid email',
            },
          }}
          type={'email'}
          placeholder={'enter school email'}
        />
      </div>

      <Input
        name='school_address'
        register={register}
        className={'border input'}
        error={errors.school_address}
        label={'school address'}
        options={{
          required: 'please provide school address',
        }}
        placeholder={'enter address'}
      />

      <div className={'md:flex gap-3'}>
        <Input
          name='school_country'
          register={register}
          className={'input'}
          error={errors.school_country}
          label={'school country'}
          options={{
            required: 'please provide school country',
          }}
          placeholder={'country'}
        />

        <Input
          name='school_city'
          register={register}
          className={'input'}
          error={errors.school_city}
          label={'school city'}
          options={{
            required: 'please provide school city',
          }}
          placeholder={'city'}
        />

        <Input
          name='school_state'
          register={register}
          className={'input'}
          error={errors.school_state}
          label={'school state'}
          options={{
            required: 'please provide school state',
          }}
          placeholder={'enter state'}
        />
      </div>

      <div className={'md:flex gap-3'}>
        <Input
          name='school_phone_number'
          register={register}
          className={'input'}
          error={errors.school_phone_number}
          label={'school phone number'}
          options={{
            required: 'please provide school phone number',
          }}
          placeholder={'phone number'}
        />

        <Input
          name='school_licence_number'
          register={register}
          className={'input'}
          error={errors.school_licence_number}
          label={'licence number'}
          options={{
            required: 'please provide school licence number',
          }}
          placeholder={'licence number'}
        />
        <Input
          name='school_postal_code'
          register={register}
          className={'input'}
          error={errors.school_postal_code}
          label={'school postal code'}
          options={{
            required: 'please provide school postal code',
          }}
          placeholder={'postal code'}
        />
      </div>
      {isLoading && <Spin size='large' />}

      <Button
        htmlType='submit'
        className='px-5 rounded-lg text-xl capitalize'
        size='large'
      >
        update school
      </Button>
    </form>
  );
};

SchoolProfile.propTypes = {
  school: PropTypes.object,
};

export default SchoolProfile;
