import { useParams } from 'react-router-dom';
import useApiQuery from '../../../hooks/useApiQuery';

const SchoolProfile = () => {
  const { id } = useParams();
  const { data } = useApiQuery(['schools', id], `schools/${id}/`);
  console.log(data);
  return <div>SchoolProfile</div>;
};

export default SchoolProfile;
