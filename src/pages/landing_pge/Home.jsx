import { Card } from 'antd';
import Hero from './components/Hero';
import { RiCustomerService2Fill } from 'react-icons/ri';
import { FaPeopleGroup } from 'react-icons/fa6';
import { BiSolidBadgeCheck } from 'react-icons/bi';
import ScrollAnimate from '../../components/ScrollAnimate';
import admin from '../../assets/admin.png';
import teacher from '../../assets/teacher-.png';

const Home = () => {
  const whyChooseUsData = [
    {
      id: 0,
      icon: <FaPeopleGroup className='text-4xl' />,
      title: 'customer',
      text: 'we put our customers and their needs first',
    },
    {
      id: 1,
      icon: <RiCustomerService2Fill className='text-4xl' />,
      title: 'customer support',
      text: 'Excellent customer support',
    },
  ];

  const users = [
    {
      id: 0,
      title: 'school administrator',
      description: '',
      details: [
        'increase efficiency by 100%',
        'stay on top of all activities within your school',
      ],
      img: admin,
    },
    {
      id: 1,
      title: 'teachers',
      description:
        'smartEdConnect provides a management system that helps you maximaize your time and effort while giving your best to your students',
      details: [
        'take attendance seamlessly',
        'compile results swiftly and effortlessly',
      ],
      img: teacher,
    },
  ];

  return (
    <div>
      <Hero />
      <div className='px-4'>
        <h3 className='text-3xl text-center md:text-left font-semibold capitalize py-4'>
          why smartEdConnect
        </h3>
        <div className='flex flex-col md:flex-row w-full gap-4'>
          {whyChooseUsData.map((data, index) => {
            const variants = {
              hidden: { opacity: 0, x: index % 2 === 0 ? 75 : -75 },
              visible: { opacity: 1, x: 0 },
            };

            return (
              <ScrollAnimate
                key={data.id}
                variants={variants}
                className={'w-full'}
              >
                <Card bordered className='basis-1/2'>
                  {data.icon}
                  <h4 className='font-semibold  capitalize text-lg py-1'>
                    {data.title}
                  </h4>
                  <p className='text-base'>{data.text}</p>
                </Card>
              </ScrollAnimate>
            );
          })}
        </div>
      </div>
      <div className='py-6 mt-4'>
        <h3 className='text-center font-semibold text-3xl capitalize'>
          A reliable school management software designed for:
        </h3>
        <div className='w-full'>
          {users.map((user, index) => (
            <ScrollAnimate
              variants={{
                hidden: { opacity: 0, y: 75 },
                visible: { opacity: 1, y: 0 },
              }}
              key={user.id}
              className={'mb-5 overflow-hidden'}
            >
              <Card className='bg-inherit border-none'>
                <div
                  className={`flex flex-col justify-center  items-center md:gap-7 ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
                  }`}
                >
                  <div className='md:w-1/2 h-72'>
                    <img
                      src={user.img}
                      alt=''
                      className='w-full object-cover'
                    />
                  </div>
                  <div className='md:w-1/2'>
                    <h5 className='font-medium text-2xl py-2 capitalize'>
                      {user.title}
                    </h5>
                    <p className='text-base leading-6 py-3'>
                      {user.description}
                    </p>
                    {user.details.map((detail) => (
                      <li
                        key={detail}
                        className='flex items-center gap-2 text-lg py-2'
                      >
                        <BiSolidBadgeCheck className='text-3xl text-header' />{' '}
                        {detail}
                      </li>
                    ))}
                  </div>
                </div>
              </Card>
            </ScrollAnimate>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
