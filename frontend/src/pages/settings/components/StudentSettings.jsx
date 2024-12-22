import { useState } from 'react';
import { Tabs } from 'antd';
import UserProfile from './UserProfile';

const StudentSettings = () => {
  const [activeKey, setActiveKey] = useState('profile');

  return (
    <div>
      <h2 className='font-medium text-xl capitalize py-2'>profile settings</h2>
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
            label: 'edit student profile',
            key: 'student',
          },
        ]}
      />
    </div>
  );
};

export default StudentSettings;
