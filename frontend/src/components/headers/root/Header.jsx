import { Link, NavLink, useSearchParams } from 'react-router-dom';
import { RiMenu2Line } from 'react-icons/ri';
import Logo from '../../Logo';
import NavBar from '../../nav/NavBar';
import { motion } from 'framer-motion';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Button } from 'antd';

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams({ menu: false });

  const showMenu = searchParams.get('menu') === 'true';

  const toggleMenu = () => {
    setSearchParams((prev) => {
      if (prev.get('menu')) {
        prev.delete('menu');
      } else {
        prev.set('menu', true);
      }
      return prev;
    });
  };

  return (
    <header className='flex justify-between w-full py-7 px-5 bg-header text-white sticky top-0 items-center z-50 opacity-95 md:px-20'>
      <Button
        className='text-3xl md:hidden border-none text-white'
        onClick={toggleMenu}
      >
        {showMenu ? (
          <AiFillCloseCircle className='' />
        ) : (
          <Link to={'?menu=true'}>
            <RiMenu2Line />
          </Link>
        )}
      </Button>
      <Logo />
      <div className='hidden md:inline-block'>
        <NavBar />
      </div>
      <div className='flex justify-between gap-1 md:gap-4 items-center'>
        <NavLink
          to={'/login'}
          className={'bg-white text-black px-3 py-1 rounded-lg'}
        >
          login
        </NavLink>
      </div>

      {showMenu && (
        <motion.div
          initial={{ y: '-20vh', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className='bg-header fixed  top-20 left-0 w-full px-8 py-7'
        >
          <NavBar />
        </motion.div>
      )}
    </header>
  );
};

export default Header;
