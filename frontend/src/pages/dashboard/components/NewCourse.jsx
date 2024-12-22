import Input from '../../../components/forms/Input';
import PropTypes from 'prop-types';
import useApiMutation from '../../../hooks/useApiMutation';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'antd';
import { PropagateLoader } from 'react-spinners';
import { useEffect, useState } from 'react';
import MultipleSelect from '../../../components/forms/MultipleSelect';

const NewCourse = ({ defaultValues, id = null }) => {
  const [selectedDepartments, setSelectedDepartments] = useState(
    defaultValues?.departments || []
  );
  const [searchParams, setSearchParams] = useSearchParams({ loading: false });
  const isLoading = searchParams.get('loading') === 'true';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const endpoint = `courses/${id ? id + '/' : ''}`;

  const method = id ? 'put' : 'post';
  const { mutateAsync } = useApiMutation(['courses'], endpoint, method);

  const onSubmit = async (data) => {
    setSearchParams(
      (prev) => {
        prev.set('loading', true);
        return prev;
      },
      { replace: true }
    );

    const updatedData = { ...data, departments: selectedDepartments };

    try {
      const res = await mutateAsync(updatedData);
      if (res.status === 'success') {
        toast.success(res?.message);
        reset();
      } else {
        toast.error('An error occurred');
      }
    } catch (error) {
      toast.error('failed! please try again.');
    } finally {
      setSearchParams(
        (prev) => {
          prev.delete('loading');
          prev.delete('modal');
          return prev;
        },
        { replace: true }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        name={'course_name'}
        register={register}
        error={errors?.course_name}
        label={'course name'}
        options={{
          required: 'this field is required',
        }}
        placeholder={'data structures and algorithms'}
        className={'input'}
      />
      <Input
        name={'course_code'}
        register={register}
        error={errors?.course_code}
        label={'course code'}
        options={{
          required: 'this field is required',
        }}
        placeholder={'cs390'}
        className={'input'}
      />
      <Input
        name={'course_description'}
        register={register}
        error={errors?.course_description}
        label={'course description'}
        options={{
          required: 'this field is required',
          maxLength: 255,
        }}
        placeholder={'A simple introduction to data structures and algorithms'}
        className={'input'}
      />

      <Input
        name={'course_credit'}
        register={register}
        error={errors?.course_credit}
        label={'course credit'}
        options={{
          required: 'this field is required',
        }}
        type={'number'}
        placeholder={'3'}
        className={'input'}
      />
      <Input
        name={'course_duration'}
        register={register}
        error={errors?.course_duration}
        label={'course duration'}
        options={{
          required: 'this field is required',
        }}
        type={'number'}
        placeholder={'16'}
        className={'input'}
      />

      <MultipleSelect
        selectedDepartments={selectedDepartments}
        setSelectedDepartments={setSelectedDepartments}
      />

      {isLoading && (
        <PropagateLoader
          color='rgba(50, 50, 255, 0.7)'
          className='text-center py-4'
        />
      )}
      <Button htmlType='submit'>submit</Button>
    </form>
  );
};

NewCourse.propTypes = {
  defaultValues: PropTypes.object,
  id: PropTypes.string,
};

export default NewCourse;
