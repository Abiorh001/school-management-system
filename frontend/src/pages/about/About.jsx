import team from '../../assets/team.png';
import logo from '../../assets/smartEdConnectlogo.jpg';

const About = () => {
  return (
    <main className='flex flex-col py-3 md:py-7 px-5 md:px-12 leading-7 gap-3'>
      <h1 className='text-4xl font-bold text-center'>About Us</h1>

      <div className='flex flex-col items-center md:flex-row gap-4'>
        <p className='md:w-1/2 leading-8 tracking-wider md:max-w-xl'>
          Welcome to our smartEdConnect School Management System, where we
          empower educational institutions with the tools they need to thrive in
          the digital age. Our mission is to streamline administrative tasks,
          enhance communication, and provide valuable insights to educators,
          students, and parents alike.
        </p>
        <div className='md:w-1/2 md:max-w-xl'>
          <img src={team} alt='' className='object-cover' />
        </div>
      </div>

      <ul className='py-7 flex flex-col md:flex-row items-center gap-4'>
        <li className='border bg-white px-2 py-2 text-center tracking-wider md:py-7'>
          With smartEdConnect, educational institutions can efficiently manage
          student records, track academic performance, and simplify
          communication channels.
        </li>
        <li>
          <img src={logo} alt='team logo' className='rounded-lg object-cover' />
        </li>
        <li className='border bg-white px-2 py-2 text-center tracking-wider md:py-7'>
          We believe in the transformative power of technology in education and
          are committed to supporting institutions in their quest for
          excellence.
        </li>
      </ul>
    </main>
  );
};

export default About;
