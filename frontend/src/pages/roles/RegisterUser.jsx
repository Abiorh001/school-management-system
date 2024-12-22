import NewUser from '../../components/NewUser';
import { Tabs } from 'antd';
import { useSearchParams } from 'react-router-dom';
import RegisterTeacherProfile from './RegisterTeacherProfile';
import RegisterStudentProfile from './RegisterStudentProfile';
import useApiQuery from '../../hooks/useApiQuery';

const RegisterUser = () => {
  const [searchParams, setSearchParams] = useSearchParams({ tab: 'user' });
  const activeTab = searchParams.get('tab');
  const { data: departments } = useApiQuery(['departments'], 'departments/');

  return (
    <div>
      <h2 className='capitalize py-2 font-bold'>
        Register new user and profile
      </h2>

      <Tabs
        activeKey={activeTab}
        onChange={(activeKey) =>
          setSearchParams((prev) => {
            prev.set('tab', activeKey);
            return prev;
          })
        }
        items={[
          {
            label: 'register user',
            key: 'user',
            children: <NewUser />,
          },
          {
            label: 'register teacher',
            key: 'teacher',
            children: (
              <RegisterTeacherProfile departments={departments?.data} />
            ),
          },
          {
            label: 'register student',
            key: 'student',
            children: <RegisterStudentProfile />,
          },
        ]}
      />
    </div>
  );
};

export default RegisterUser;
