import { useState } from 'react';
import useApiQuery from '../../hooks/useApiQuery';
import { useSearchParams } from 'react-router-dom';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { Button, Popconfirm, Tabs, Typography } from 'antd';
import authRequest from '../../config/requests';
import { toast } from 'react-toastify';
import EditModal from '../../components/modals/EditModal';
import UserTable from '../../components/UserTable';
import NewCourse from './components/NewCourse';
import { arrayToString } from '../../utils/helpers';
import useAuthState from '../../hooks/useAuth';

const Courses = () => {
  const { user } = useAuthState();
  const [searchParams, setParams] = useSearchParams({
    tab: 'all',
    modal: false,
  });
  const [record, setRecord] = useState(null);

  const { Text } = Typography;

  const activeTab = searchParams.get('tab');
  const isModalOpen = searchParams.get('modal') === 'true';

  const { data: courses, refetch } = useApiQuery(['courses'], 'courses/');

  // new course default from values

  const defaultValues = {
    course_name: '',
    course_code: '',
    course_description: '',
    course_credit: '',
    course_duration: '',
    departments: [],
    school_id: user?.school_id,
  };

  // edit course default form values
  const editDefaultValues = {
    course_name: record?.course_name,
    course_code: record?.course_code,
    course_description: record?.course_description,
    course_credit: record?.course_credit,
    course_duration: record?.course_duration,
    departments: record?.departments,
    school_id: user.school_id,
  };

  // handle course delete
  const deleteCourse = async (id) => {
    try {
      const res = await authRequest.delete(`courses/${id}/`);
      if (res.status === 204) {
        toast.success('course deleted!');
        refetch();
      } else {
        toast.error('An error occurred while deleting course');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred');
    }
  };

  //handle modal close
  const closeModal = () => {
    console.log('function');
    setParams((prev) => {
      prev.delete('modal');
      return prev;
    });
  };

  // table columns for courses
  const columns = [
    {
      title: 'Name',
      dataIndex: 'course_name',
      key: 'course_name',
    },
    {
      title: 'Code',
      dataIndex: 'course_code',
      key: 'course_code',
    },
    {
      title: 'Id',
      dataIndex: 'course_id',
      key: 'course_id',
      render: (id) => {
        return <Text copyable>{id}</Text>;
      },
    },
    {
      title: 'Credits',
      dataIndex: 'course_credit',
      key: 'course_credit',
    },
    {
      title: 'departments',
      dataIndex: 'departments_name',
      key: 'departments_name',
      render: (data) => {
        const str = arrayToString(data);
        return <span>{str}</span>;
      },
    },
    {
      title: 'Action',
      dataIndex: 'actions',
      render: (_, record) => (
        <div className='flex items-center gap-1'>
          <Popconfirm
            title='delete course'
            description='Are you sure you want to delete this course? this action is irreversible'
            onCancel={(e) => e.stopPropagation()}
            onConfirm={(e) => {
              e.stopPropagation();
              deleteCourse(record.course_id);
            }}
            okButtonProps={{ className: 'bg-red-700' }}
          >
            <Button
              danger
              onClick={(e) => {
                e.stopPropagation();
              }}
              className='border-none flex items-center'
            >
              {' '}
              <MdDelete className='text-xl' />
            </Button>
          </Popconfirm>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setParams((prev) => {
                prev.set('modal', true);
                return prev;
              });
              setRecord(record);
            }}
            className='border-none flex items-center'
          >
            {' '}
            <MdModeEdit className='text-xl' />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 className='font-semibold text-3xl capitalize pb-4'>courses</h2>
      <Tabs
        activeKey={activeTab}
        onChange={(activeKey) =>
          setParams(
            (prev) => {
              prev.set('tab', activeKey);
              return prev;
            },
            { replace: true }
          )
        }
        items={[
          {
            label: 'All',
            key: 'all',
            children: (
              <UserTable
                columns={columns}
                data={courses?.data}
                route={''}
                type={'course'}
                rowKey={'course_id'}
                allowClick={true}
              />
            ),
          },
          {
            label: 'New',
            key: 'new',
            children: <NewCourse defaultValues={defaultValues} />,
          },
        ]}
      />

      <EditModal
        isModalOpen={isModalOpen}
        handleSubmit={closeModal}
        handleClose={closeModal}
      >
        <h3 className='font-semibold'>Edit course</h3>
        <NewCourse defaultValues={editDefaultValues} id={record?.course_id} />
      </EditModal>
    </div>
  );
};

export default Courses;
