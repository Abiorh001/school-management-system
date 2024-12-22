import { useParams } from 'react-router-dom';
import useApiQuery from '../../hooks/useApiQuery';
import { HashLoader } from 'react-spinners';
import PropTypes from 'prop-types';
import { Typography } from 'antd';

const TeacherDetails = () => {
  const { id } = useParams();
  const { data } = useApiQuery([`teachers`, id], `teachers/${id}/`);
  const teacher = data?.data;

  console.log(teacher);
  if (!teacher) return <HashLoader color='#36d7b7' />;
  const date = new Date(teacher.date_of_birth);
  return (
    <div className=''>
      <div className='flex justify-between flex-col md:flex-row items-center pb-7'>
        <h2 className='font-medium capitalize text-2xl'>user profile</h2>
        <p
          className='font-medium
         text-lg capitalize'
        >
          {teacher.school_name}
        </p>
      </div>
      <>
        <div className='flex flex-col items-center justify-between md:flex-row'>
          <MiniCard
            heading={'name'}
            content={`${teacher.user_first_name} ${teacher.user_last_name}`}
          />
          <MiniCard heading={'gender'} content={teacher.gender} />
        </div>
        <MiniCard
          heading={'user id'}
          content={teacher.user_id}
          canCopy={true}
        />
        <div className='flex-col flex lg:flex-row justify-between'>
          <MiniCard
            heading={'teacher id'}
            content={teacher.teacher_id}
            canCopy={true}
          />
          <MiniCard
            heading={'licence number'}
            content={teacher.license_number}
          />
        </div>
        <div className='flex md:flex-row justify-between flex-col'>
          <MiniCard heading={'city'} content={teacher.city} />
          <MiniCard heading={'state'} content={teacher.state} />
          <MiniCard heading={'country'} content={teacher.country} />
        </div>
        <MiniCard heading={'date of birth'} content={date.toDateString()} />

        {/* <div className='flex-col flex lg:flex-row justify-between'>
          <MiniCard
            heading={'department name'}
            content={teacher.department_name}
          />
          <MiniCard
            heading={'department_id'}
            content={teacher.department_id}
            canCopy={true}
          />
        </div> */}
      </>
    </div>
  );
};

export default TeacherDetails;

const MiniCard = ({ heading, content, canCopy = false }) => {
  const { Paragraph } = Typography;

  return (
    <div className='w-fit px-7 py-2'>
      <h4 className='underline w-full capitalize text-xl font-medium py-2'>
        {heading}
      </h4>
      <Paragraph className='text-lg' copyable={canCopy}>
        {content}{' '}
      </Paragraph>
    </div>
  );
};

MiniCard.propTypes = {
  heading: PropTypes.string,
  content: PropTypes.string,
  canCopy: PropTypes.bool,
};
