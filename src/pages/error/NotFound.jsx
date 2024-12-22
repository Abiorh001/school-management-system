// import Header from '../../components/headers/root/Header';

import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <main className='error h-screen bg-no-repeat flex flex-col items-center justify-center bg-top-left px-4 gap-6'>
      <h1 className='text-5xl md:text-9xl font-semibold'>404</h1>
      <h2 className='text-3xl md:text-[4rem] font-normal'>page not found</h2>
      <p className='text-sm md:text-lg font-medium text-center'>
        we&#39;re sorry. the page you requested could not be found Please go
        back to the home page
      </p>
      <section className='flex items-center gap-3'>
        <Link
          to={'/'}
          className='capitalize bg-btn px-7 py-2 rounded-xl text-xl'
        >
          go home
        </Link>
        <Button
          onClick={() => navigate(-1)}
          className='bg-light-btn capitalize text-lg rounded-md py-2 px-5'
        >
          go back
        </Button>
      </section>
    </main>
  );
};

export default NotFound;
