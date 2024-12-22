import useAuthState from '../../hooks/useAuth';
import SchoolSettings from './components/SchoolSettings';
import StudentSettings from './components/StudentSettings';
import SuperAdminSettings from './components/SuperAdminSettings';
import TeacherSettings from './components/TeacherSettings';

const Settings = () => {
  const { user } = useAuthState();
  const role = user.role.toLowerCase();
  return (
    <>
      {role === 'schooladmin' ? (
        <SchoolSettings />
      ) : role === 'student' ? (
        <StudentSettings />
      ) : role === 'teacher' ? (
        <TeacherSettings />
      ) : role === 'superuser' ? (
        <SuperAdminSettings />
      ) : (
        <p>settings</p>
      )}
    </>
  );
};

export default Settings;
