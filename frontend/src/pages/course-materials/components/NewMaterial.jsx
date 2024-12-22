import { toast } from 'react-toastify';
import useApiMutation from '../../../hooks/useApiMutation';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import { Button } from 'antd';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '../../../components/forms/Input';

export default function NewMaterial({ defaultValues, id = null }) {
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

  const endpoint = `course-materials/${id ? id + '/' : ''}`;

  const method = id ? 'put' : 'post';
  const { mutateAsync } = useApiMutation(['materials'], endpoint, method);

  const onSubmit = async (data) => {
    setSearchParams(
      (prev) => {
        prev.set('loading', true);
        return prev;
      },
      { replace: true }
    );

    const material = data.course_material_file[0];

    const formData = new FormData();
    formData.append('course_material_file', material);
    formData.append('course_material_name', data.course_material_name);
    formData.append('course_id', data.course_id);
    formData.append('school_id', data.school_id);

    try {
      const res = await mutateAsync(formData);
      console.log(res);
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
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
      <Input
        name={'course_material_name'}
        register={register}
        error={errors?.course_material_name}
        label={'course material name'}
        options={{
          required: 'this field is required',
        }}
        placeholder={'material name'}
        className={'input'}
      />
      <Input
        name={'course_id'}
        register={register}
        error={errors?.course_id}
        label={'course id'}
        options={{
          required: 'this field is required',
        }}
        placeholder={'course id'}
        className={'input'}
      />
      <Input
        name={'course_material_file'}
        register={register}
        error={errors?.course_material_file}
        label={'course material'}
        options={{
          required: 'this field is required',
        }}
        placeholder={'course material file'}
        className={'input'}
        type={'file'}
      />

      {isLoading && (
        <PropagateLoader
          color='rgba(50, 50, 255, 0.7)'
          className='text-center py-4'
        />
      )}
      <Button htmlType='submit' className='w-fit'>
        submit
      </Button>
    </form>
  );
}

NewMaterial.propTypes = {
  defaultValues: PropTypes.object,
  id: PropTypes.string,
};
