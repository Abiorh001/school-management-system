import { useParams } from 'react-router-dom';
import useApiQuery from '../../../hooks/useApiQuery';
import { HashLoader } from 'react-spinners';
import PropTypes from 'prop-types';
import { Typography } from 'antd';

const StudentDetails = () => {
  const { id } = useParams();
  const { data } = useApiQuery([`students`, id], `students/${id}/`);
  const student = data?.data;

  if (!student) return <HashLoader color='#36d7b7' />;
  const date = new Date(student.date_of_birth);
  return (
    <div className=''>
      <div className='flex justify-between flex-col md:flex-row items-center pb-7'>
        <h2 className='font-medium capitalize text-2xl'>user profile</h2>
        <p
          className='font-medium
         text-lg capitalize'
        >
          {student.school_name}
        </p>
      </div>
      <>
        <div className='flex flex-col items-center justify-between md:flex-row'>
          <MiniCard
            heading={'name'}
            content={`${student.user_first_name} ${student.user_last_name}`}
          />
          <MiniCard heading={'gender'} content={student.gender} />
        </div>
        <MiniCard
          heading={'user id'}
          content={student.user_id}
          canCopy={true}
        />
        <div className='flex-col flex lg:flex-row justify-between'>
          <MiniCard
            heading={'student id'}
            content={student.student_id}
            canCopy={true}
          />
          <MiniCard
            heading={'student id number'}
            content={student.student_id_number}
          />
        </div>
        <div className='flex md:flex-row justify-between flex-col'>
          <MiniCard heading={'city'} content={student.city} />
          <MiniCard heading={'state'} content={student.state} />
          <MiniCard heading={'country'} content={student.country} />
        </div>
        <MiniCard heading={'date of birth'} content={date.toDateString()} />

        <div className='flex-col flex lg:flex-row justify-between'>
          <MiniCard
            heading={'department name'}
            content={student.department_name}
          />
          <MiniCard
            heading={'department_id'}
            content={student.department_id}
            canCopy={true}
          />
        </div>
      </>
    </div>
  );
};

export default StudentDetails;

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
