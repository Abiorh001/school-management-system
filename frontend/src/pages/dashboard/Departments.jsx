import { Button, Popconfirm, Tabs } from 'antd';
import { useSearchParams } from 'react-router-dom';
import UserTable from '../../components/UserTable';
import useApiQuery from '../../hooks/useApiQuery';
import NewDepartment from './components/NewDepartment';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import authRequest from '../../config/requests';
import { toast } from 'react-toastify';
import EditModal from '../../components/modals/EditModal';
import { useState } from 'react';

const Departments = () => {
  const [searchParams, setParams] = useSearchParams({
    tab: 'all',
    modal: false,
  });
  const [record, setRecord] = useState(null);

  const activeTab = searchParams.get('tab');
  const isModalOpen = searchParams.get('modal') === 'true';

  const { data: departments, refetch } = useApiQuery(
    ['departments'],
    'departments/'
  );

  // handle department delete
  const deleteDepartment = async (id) => {
    try {
      const res = await authRequest.delete(`departments/${id}/`);
      console.log(res);
      if (res.status === 204) {
        toast.success('department deleted!');
        refetch();
      } else {
        toast.error('An error occurred while deleting department');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred');
    }
  };

  //handle modal close
  const closeModal = () => {
    setParams((prev) => {
      prev.delete('modal');
      return prev;
    });
  };

  const editDepartment = async () => {
    const data = {
      department_name: record.department_name,
      school_id: record.school_id,
    };
    try {
      const res = await authRequest.put(
        `departments/${record.department_id}/`,
        data
      );
      if (res.status === 200) {
        toast.success(res.data?.data?.message);
        refetch();
        closeModal();
      } else {
        toast.error('An error occurred updating department');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred');
    }
  };

  // table columns for departments
  const columns = [
    {
      title: 'Name',
      dataIndex: 'department_name',
      key: 'department_name',
    },
    {
      title: 'Id',
      dataIndex: 'department_id',
      key: 'department_id',
    },
    {
      title: 'Action',
      dataIndex: 'actions',
      render: (_, record) => (
        <div className='flex items-center gap-1'>
          <Popconfirm
            title='delete department'
            description='Are you sure you want to delete this department? this action is irreversible'
            onCancel={(e) => e.stopPropagation()}
            onConfirm={(e) => {
              e.stopPropagation();
              deleteDepartment(record.department_id);
              refetch();
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
      <h2>Departments</h2>
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
                data={departments?.data}
                route={''}
                type={'department'}
                rowKey={'department_id'}
                allowClick={false}
              />
            ),
          },
          {
            label: 'New',
            key: 'new',
            children: <NewDepartment />,
          },
        ]}
      />

      <EditModal
        isModalOpen={isModalOpen}
        handleSubmit={editDepartment}
        handleClose={closeModal}
      >
        <label htmlFor='department_name'>department name</label>
        <input
          type='text'
          value={record?.department_name}
          onChange={(e) =>
            setRecord((prev) => ({
              ...prev,
              department_name: e.target.value,
            }))
          }
          name='department_name'
          id='department_name'
          className='input'
        />
      </EditModal>
    </div>
  );
};

export default Departments;
