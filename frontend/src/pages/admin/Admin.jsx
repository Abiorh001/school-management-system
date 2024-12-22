import { useState } from 'react';
import Header from '../../components/headers/dashboard/Header';
import useApiQuery from '../../hooks/useApiQuery';
import { Tabs } from 'antd';
import UserTable from '../../components/UserTable';

const SuperAdmin = () => {
  // tabs state
  const [activeKey, setActiveKey] = useState('schools');
  const { data: schools } = useApiQuery(['schools'], 'schools/');

  const schoolColumns = [
    {
      title: 'School logo',
      dataIndex: 'school_logo',
      key: 'school_logo',
      render: (img) => {
        return (
          <img
            src={img}
            width={50}
            className='rounded-full'
            alt="school's logo"
          />
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'school_name',
      key: 'school_name',
    },
    {
      title: 'email',
      dataIndex: 'school_email',
      key: 'school_email',
    },
  ];

  return (
    <div>
      <Header />
      <Tabs
        activeKey={activeKey}
        onChange={(activeKey) => setActiveKey(activeKey)}
        items={[
          {
            label: 'schools',
            key: 'schools',
            children: (
              <UserTable
                columns={schoolColumns}
                data={schools?.data}
                route={'/dashboard/su/school/'}
                rowKey={'school_id'}
                allowClick={false}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default SuperAdmin;
