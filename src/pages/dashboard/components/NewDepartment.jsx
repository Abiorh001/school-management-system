import { useForm } from 'react-hook-form';
import useApiMutation from '../../../hooks/useApiMutation';
import useAuthState from '../../../hooks/useAuth';
import Input from '../../../components/forms/Input';
import { Button } from 'antd';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';

const NewDepartment = () => {
  const { user } = useAuthState();
  const [searchParams, setSearchParams] = useSearchParams({ loading: false });

  const isLoading = searchParams.get('loading') === 'true';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      department_name: '',
      school_id: user.school_id,
    },
  });
  const { mutateAsync } = useApiMutation(['departments'], 'departments/');

  const onSubmit = async (data) => {
    setSearchParams(
      (prev) => {
        prev.set('loading', true);
        return prev;
      },
      { replace: true }
    );
    try {
      const res = await mutateAsync(data);
      if (res.status === 'success') {
        toast.success(res?.message);
        reset();
      } else {
        toast.error('An error occurred while creating department');
      }
    } catch (error) {
      toast.error('failed! please try again.');
    } finally {
      setSearchParams(
        (prev) => {
          prev.delete('loading');
          return prev;
        },
        { replace: true }
      );
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        name='department_name'
        error={errors?.department_name}
        label={'department name'}
        register={register}
        placeholder={'name of department'}
        options={{
          required: 'please enter name of department',
        }}
        className={'input'}
      />
      {isLoading && (
        <PropagateLoader
          color='rgba(50, 50, 255, 0.7)'
          className='text-center py-4'
        />
      )}
      <Button htmlType='submit' disabled={isLoading}>
        submit
      </Button>
    </form>
  );
};

export default NewDepartment;
