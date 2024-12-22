import useApiQuery from '../../../hooks/useApiQuery';
import useAuthState from '../../../hooks/useAuth';
import { useState } from 'react';
import { Tabs } from 'antd';
import UserProfile from './UserProfile';
import SchoolProfile from './SchoolProfile';

const SchoolSettings = () => {
  const { user } = useAuthState();

  const { data: school } = useApiQuery(['school'], `schools/${user.school_id}`);

  const [activeKey, setActiveKey] = useState('profile');

  return (
    <div className='py-2'>
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
            label: 'edit school',
            key: 'school',
            children: <SchoolProfile school={school?.data} />,
          },
        ]}
      />
    </div>
  );
};

export default SchoolSettings;
