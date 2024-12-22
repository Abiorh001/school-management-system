import { useNavigate, useParams } from 'react-router-dom';
import useApiQuery from '../../../hooks/useApiQuery';
import { BounceLoader } from 'react-spinners';
import { arrayToString } from '../../../utils/helpers';
import { Button } from 'antd';

const ViewCourse = () => {
  const { id } = useParams();

  const { data, isLoading } = useApiQuery(['courses', id], `courses/${id}/`);

  const course = data?.data;
  const navigate = useNavigate();

  if (isLoading)
    return (
      <div className='flex justify-center items-center py-20'>
        <BounceLoader color='rgba(50, 50, 255, 0.7)' className='text-center' />
      </div>
    );
  const departments = arrayToString(course?.departments_name);
  const style = 'py-2 text-lg';

  return (
    <div>
      <h2 className='font-medium text-2xl capitalize pb-3'>course details</h2>
      <p className={style}>course id : {course?.course_id}</p>
      <p className={style}>course name : {course?.course_name}</p>
      <p className={style}>course code : {course?.course_code}</p>
      <p className={style}>course credit : {course?.course_credit}</p>
      <p className={style}>course description : {course?.course_description}</p>
      <p className={style}>departments : {departments}</p>
      <Button onClick={() => navigate(-1)} className='my-3 bg-dashboard-200'>
        go back
      </Button>
    </div>
  );
};

export default ViewCourse;
