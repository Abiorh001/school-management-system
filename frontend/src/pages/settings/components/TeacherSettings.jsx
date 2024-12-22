import { Tabs } from 'antd';
import { useState } from 'react';
import UserProfile from './UserProfile';

const TeacherSettings = () => {
  const [activeKey, setActiveKey] = useState('profile');
  return (
    <div>
      <div>
        <h2 className='font-medium text-xl capitalize py-2'>
          profile settings
        </h2>
        <Tabs
          activeKey={activeKey}
          onChange={(activeKey) => setActiveKey(activeKey)}
          items={[
            {
              label: 'edit profile',
              key: 'profile',
              children: <UserProfile />,
            },

            {
              label: 'edit teacher profile',
              key: 'teacher',
            },
          ]}
        />
      </div>
    </div>
  );
};

export default TeacherSettings;
