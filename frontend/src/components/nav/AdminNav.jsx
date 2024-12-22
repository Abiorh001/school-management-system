import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav>
      <ul className='grid place-content-center w-full'>
        <li className=''>
          <NavLink to={''}></NavLink>
        </li>

        <li className='link w-full'>
          <NavLink to={'new-school'} className={'text-left'}>
            add school
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
