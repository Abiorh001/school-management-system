import { useState } from 'react';
import authRequest from '../config/requests';
import Input from './forms/Input';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Modal, Button as AntButton, Typography, List } from 'antd';
import { AiOutlineSend } from 'react-icons/ai';
import { MdContentCopy, MdOutlineCheckCircle } from 'react-icons/md';
import useAuthState from '../hooks/useAuth';
import useApiQuery from '../hooks/useApiQuery';
import { GridLoader, PropagateLoader } from 'react-spinners';
import { useSearchParams } from 'react-router-dom';
import useApiMutation from '../hooks/useApiMutation';

const NewUser = () => {
  const [isNewRole, setIsNewRole] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams({
    loading: false,
    modal: false,
    id: '',
  });

  // handle mutations
  const { mutateAsync } = useApiMutation(['users'], 'auth/sign_up/');

  const isModalOpen = searchParams.get('modal') === 'true';

  const isSending = searchParams.get('loading') === 'true';
  const userId = searchParams.get('id');

  const { Text } = Typography;

  const { data, refetch: refetchRoles } = useApiQuery(['roles'], 'roles/');
  const roles = data?.data;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role_name: '',
    },
  });

  const { user } = useAuthState();
  const isSchoolAdmin = user.role.toLowerCase() === 'schooladmin';

  const filteredRoles = roles?.filter((role) => {
    if (isSchoolAdmin) {
      return !['superuser'].includes(role.role_name.toLowerCase());
    }
    return role;
  });

  //
  const {
    register: registerUser,
    handleSubmit: handleUserSubmit,
    formState: { errors: Errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role_id: '',
      school_id: user.school_id,
      confirm_password: '',
    },
  });

  // handle new role creation
  const onSubmit = async (data) => {
    try {
      const res = await authRequest.post('roles/', data);
      if (res.status === 201) {
        toast.success('role id created successfully!');
        refetchRoles();
      } else {
        toast.error('error creating role!');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred');
    }
  };

  // handle new user creation
  const createUser = async (data) => {
    updateSearchParams('loading', true);
    try {
      const res = await mutateAsync(data);
      console.log(res);
      if (res.status === 'success') {
        updateSearchParams('modal', true);
        updateSearchParams('id', res?.data?.id);
        reset();
      } else {
        toast.error('error registering user');
      }
    } catch (error) {
      toast.error(error.detail);
    } finally {
      updateSearchParams('loading', '', 'remove');
    }
  };

  // handle button toggle for new role name creation
  const toggleButton = () => {
    setIsNewRole((prev) => !prev);
  };

  // handle search params / url update
  const updateSearchParams = (key, value = '', type = '') => {
    setSearchParams(
      (prev) => {
        if (type === 'remove') {
          prev.delete(key);
        } else {
          prev.set(key, value);
        }
        return prev;
      },
      { replace: true }
    );
  };

  if (isSending) {
    return (
      <div className='grid place-content-center py-40'>
        <PropagateLoader color='#36d7b7' />
      </div>
    );
  }

  return (
    <>
      <Modal
        open={isModalOpen}
        onCancel={() => {
          updateSearchParams('modal', '', 'remove');
          updateSearchParams('id', '', 'remove');
        }}
        footer={[
          <AntButton
            key={'ok'}
            onClick={() => {
              updateSearchParams('modal', '', 'remove');
              updateSearchParams('id', '', 'remove');
            }}
          >
            ok
          </AntButton>,
        ]}
        centered={true}
        confirmLoading={true}
      >
        <p>user created successfully!</p>
        <Text
          copyable={{
            icon: [
              <MdContentCopy key={'copy-icon'} />,
              <MdOutlineCheckCircle key={'copied-icon'} />,
            ],
            tooltips: ['click here to copy', 'copied!'],
          }}
          className='flex items-center'
        >
          {userId}
        </Text>
      </Modal>
      <div>
        <h4>Available roles</h4>
        {data ? (
          <List
            size='small'
            pagination={false}
            dataSource={filteredRoles}
            className='my-3'
            renderItem={(item) => (
              <List.Item key={item?.school_id}>
                <div className='flex items-center gap-5 justify-start'>
                  <h5 className='text-sm'>{item.role_name}</h5>
                  <Text
                    copyable={{
                      icon: [
                        <MdContentCopy key={'copy-icon'} />,
                        <MdOutlineCheckCircle key={'copied-icon'} />,
                      ],
                      tooltips: ['click here to copy', 'copied!'],
                    }}
                    className='flex items-center'
                  >
                    {item.role_id}
                  </Text>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <GridLoader color='#36d7b7' />
        )}
      </div>

      <div
        className={`flex flex-col justify-center px-5 md:px-10 py-4 rounded-md my-5 ${
          isNewRole && 'border'
        }`}
      >
        <AntButton
          className={`self-end transition transform ease-in-out duration-75 ${
            isNewRole && 'text-red-500 border-red-500'
          }`}
          onClick={toggleButton}
        >
          {isNewRole ? 'close' : 'create role name'}
        </AntButton>

        {isNewRole && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              name='role_name'
              register={register}
              error={errors.role_name}
              options={{
                required: 'please provide a role name',
              }}
              placeholder={isSchoolAdmin ? 'student or teacher' : 'schooladmin'}
              className={'input'}
              label={'role name:'}
            />
            <AntButton htmlType='submit'>submit</AntButton>
          </form>
        )}
      </div>

      <form onSubmit={handleUserSubmit(createUser)} className='my-5'>
        <div className='flex flex-col md:flex-row gap-3'>
          <Input
            name='first_name'
            register={registerUser}
            className={'input'}
            error={Errors.first_name}
            label={'first name'}
            options={{
              required: 'please provide first name',
            }}
            placeholder={'first name'}
          />

          <Input
            name='last_name'
            register={registerUser}
            className={'input'}
            error={Errors.last_name}
            label={'last name'}
            options={{
              required: 'please provide last name',
            }}
            placeholder={'last name'}
          />
        </div>
        <Input
          name='email'
          register={registerUser}
          className={'input border w-full'}
          error={Errors.email}
          label={'email'}
          options={{
            required: '',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'enter a valid email',
            },
          }}
          placeholder={'enter email address'}
          type='email'
        />

        <div className='flex flex-col md:flex-row gap-3'>
          <Input
            name='password'
            register={registerUser}
            className={'input'}
            error={Errors.password}
            label={'password'}
            options={{
              required: 'please provide password',
            }}
            placeholder={'*******'}
            type='password'
          />
          <Input
            name='confirm_password'
            register={registerUser}
            className={'input'}
            error={Errors.confirm_password}
            label={'confirm password'}
            options={{
              required: true,
              validate: (val) => {
                if (watch('password') !== val) {
                  return 'passwords do not match';
                }
              },
            }}
            placeholder={'*******'}
            type='password'
          />
        </div>
        <div className='flex flex-col md:flex-row gap-3'>
          <Input
            name='role_id'
            register={registerUser}
            className={'input'}
            error={Errors.role_id}
            label={'role id'}
            options={{
              required: 'please provide role id above',
            }}
            placeholder={'enter role id'}
          />
        </div>
        <AntButton
          htmlType='submit'
          icon={<AiOutlineSend />}
          className='flex items-center'
          size='middle'
          type='default'
          loading=''
        >
          submit
        </AntButton>
      </form>
    </>
  );
};

export default NewUser;
