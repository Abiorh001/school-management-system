import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className='text-white'>
      <ul className='flex gap-7 md:flex-row flex-col capitalize'>
        <li>
          <NavLink
            to={''}
            className={
              'capitalize hover:text-orange-500 transform transition-colors duration-75'
            }
          >
            home
          </NavLink>
        </li>
        <li>
          <NavLink
            to={'/about'}
            className={
              'hover:text-orange-500 transform transition-colors duration-75'
            }
          >
            about
          </NavLink>
        </li>
        <li>
          <NavLink
            to={'/contact'}
            className={
              'hover:text-orange-500 transform transition-colors duration-75'
            }
          >
            contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
