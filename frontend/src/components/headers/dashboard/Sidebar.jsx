import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AiOutlineHome,
  AiOutlineMenuUnfold,
  AiOutlineMenuFold,
  AiFillCloseCircle,
} from 'react-icons/ai';
import { IoSettingsOutline } from 'react-icons/io5';
import { TbLogout2 } from 'react-icons/tb';
import { GiArchiveRegister } from 'react-icons/gi';
import { FcDepartment } from 'react-icons/fc';
import Logo from '../../Logo';
import Button from '../../Button';
import useAuthState from '../../../hooks/useAuth';
import { PiBooks } from 'react-icons/pi';
import { RiSchoolLine } from 'react-icons/ri';
import { motion } from 'framer-motion';
import { roleUrl } from '../../../consts';

const Sidebar = () => {
  const { user, setUser } = useAuthState();

  const [searchParams, setSearchParams] = useSearchParams({ menu: false });

  const showMenu = searchParams.get('menu') === 'true';

  const toggleMenu = () => {
    setSearchParams((prev) => {
      if (prev.has('menu')) {
        prev.delete('menu');
      } else {
        prev.set('menu', true);
      }
      return prev;
    });
  };

  const role = user?.role;
  const superAdmin = role === 'superuser';
  const admin = role === 'SCHOOLADMIN';
  const admins = admin || superAdmin;
  //const teacher = role === 'teacher';
  //const student = role ==='student';
  const navigate = useNavigate();
  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('auth');
    navigate('/login');
  };

  const url = roleUrl[role];

  return (
    <aside className='h-full bg-header   text-white md:w-3/12 mx-auto'>
      <div className='hidden  w-full py-8 h-full md:flex flex-col'>
        <Logo />
        <nav className='md:py-10'>
          <ul className='flex gap-7 flex-col justify-center capitalize'>
            <li>
              <NavLink
                to={`/dashboard/${url}`}
                className={({ isActive }) =>
                  isActive ? 'dactive dlink' : 'dlink'
                }
                end
              >
                <AiOutlineHome className='icon' />
                dashboard
              </NavLink>
            </li>
            {/* superuser and school admins have access */}
            {/* {admins && (
              <>
                <li>
                  <NavLink
                    to={`/dashboard/register?tab=user`}
                    className={({ isActive }) =>
                      isActive ? 'dactive dlink' : 'dlink'
                    }
                  >
                    <GiArchiveRegister className='icon' />
                    register user
                  </NavLink>
                </li>
              </>
            )} */}

            {admin && (
              <>
                <li>
                  <NavLink
                    to={`/dashboard/register?tab=user`}
                    className={({ isActive }) =>
                      isActive ? 'dactive dlink' : 'dlink'
                    }
                  >
                    <GiArchiveRegister className='icon' />
                    register user
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={`/dashboard/sa/departments?tab=all`}
                    className={({ isActive }) =>
                      isActive ? 'dactive dlink' : 'dlink'
                    }
                  >
                    <FcDepartment className='icon' />
                    departments
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={`/dashboard/sa/courses?tab=all`}
                    className={({ isActive }) =>
                      isActive ? 'dactive dlink' : 'dlink'
                    }
                  >
                    <PiBooks className='icon' />
                    courses
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={`/dashboard/sa/materials?tab=all`}
                    className={({ isActive }) =>
                      isActive ? 'dactive dlink' : 'dlink'
                    }
                  >
                    <PiBooks className='icon' />
                    materials
                  </NavLink>
                </li>
              </>
            )}

            {superAdmin && (
              <>
                <li>
                  <NavLink
                    to={'/dashboard/su/new_school/'}
                    className={({ isActive }) =>
                      isActive ? 'dactive dlink' : 'dlink'
                    }
                  >
                    <RiSchoolLine />
                    register school
                  </NavLink>
                </li>
              </>
            )}
            <li>
              <NavLink
                to={'/dashboard/settings'}
                className={({ isActive }) =>
                  isActive ? 'dactive dlink' : 'dlink'
                }
              >
                <IoSettingsOutline />
                settings
              </NavLink>
            </li>
          </ul>
        </nav>

        <Button
          className={
            'mt-auto px-12 w-fit py-2 rounded-sm flex items-center text-left outline-none gap-2 font-bold justify-start text-base capitalize  text-cm-orange-100'
          }
          onClick={handleSignOut}
        >
          <TbLogout2 /> sign out
        </Button>
      </div>

      {/* mobile nav */}

      <Button
        className='fixed right-4 z-50 bottom-12 flex md:hidden bg-blue-800 rounded-full p-2'
        onClick={toggleMenu}
      >
        {showMenu ? (
          <AiOutlineMenuUnfold className='text-3xl' />
        ) : (
          <AiOutlineMenuFold className='text-3xl' />
        )}
      </Button>
      {showMenu && (
        <motion.div
          initial={{ x: '-100vw', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100vw', opacity: 0 }}
          transition={{ duration: 1 }}
          className='fixed top-0 left-0 z-30 bg-header flex flex-col h-screen overflow-y-scroll py-5 md:hidden items-start pr-5 justify-start'
        >
          <Button
            className={'absolute right-2 top-3 text-3xl'}
            onClick={toggleMenu}
          >
            <AiFillCloseCircle />
          </Button>
          <Logo />
          <nav className='px-3 py-5'>
            <ul className='flex flex-col capitalize'>
              <li>
                <NavLink
                  to={`/dashboard/${url}`}
                  className={({ isActive }) =>
                    isActive ? 'dactive dlink' : 'dlink'
                  }
                  end
                >
                  <AiOutlineHome className='icon' />
                  dashboard
                </NavLink>
              </li>
              {/* superuser and school admins have access */}
              {admins && (
                <>
                  <li>
                    <NavLink
                      to={`/dashboard/register?tab=user`}
                      className={({ isActive }) =>
                        isActive ? 'dactive dlink' : 'dlink'
                      }
                    >
                      <GiArchiveRegister className='icon' />
                      register user
                    </NavLink>
                  </li>
                </>
              )}

              {admin && (
                <>
                  <li>
                    <NavLink
                      to={`/dashboard/sa/departments?tab=all`}
                      className={({ isActive }) =>
                        isActive ? 'dactive dlink' : 'dlink'
                      }
                    >
                      <FcDepartment className='icon' />
                      departments
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={`/dashboard/sa/courses?tab=all`}
                      className={({ isActive }) =>
                        isActive ? 'dactive dlink' : 'dlink'
                      }
                    >
                      <PiBooks className='icon' />
                      courses
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={`/dashboard/sa/materials?tab=all`}
                      className={({ isActive }) =>
                        isActive ? 'dactive dlink' : 'dlink'
                      }
                    >
                      <PiBooks className='icon' />
                      materials
                    </NavLink>
                  </li>
                </>
              )}

              {superAdmin && (
                <>
                  <li>
                    <NavLink
                      to={'/dashboard/su/new_school/'}
                      className={({ isActive }) =>
                        isActive ? 'dactive dlink' : 'dlink'
                      }
                    >
                      register school
                    </NavLink>
                  </li>
                </>
              )}
              <li>
                <NavLink
                  to={'/dashboard/settings'}
                  className={({ isActive }) =>
                    isActive ? 'dactive dlink' : 'dlink'
                  }
                >
                  <IoSettingsOutline />
                  settings
                </NavLink>
              </li>
            </ul>
          </nav>
          <Button
            className={
              ' px-12 w-full py-2 rounded-sm flex items-center gap-2 font-bold text-base capitalize  text-cm-orange-100 text-left'
            }
            onClick={handleSignOut}
          >
            <TbLogout2 /> sign out
          </Button>
        </motion.div>
      )}
    </aside>
  );
};

export default Sidebar;
