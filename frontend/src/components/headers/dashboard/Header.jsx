// import Search from '../../Search';
import LetteredAvatar from 'react-lettered-avatar';
import useAuthState from '../../../hooks/useAuth';

const Header = () => {
  const { user } = useAuthState();

  return (
    <div className=''>
      <header className={'flex justify-end items-center'}>
        {/* <Search /> */}
        <div className={'flex'}>
          <LetteredAvatar name={`${user?.first_name} ${user?.last_name}`} />
        </div>
      </header>

      <div className='bg-header bg-[url("../src/assets/teach.png")] py-14 bg-no-repeat bg-contain bg-right-bottom text-white rounded-lg my-5 px-12'>
        <h2 className='text-xl'>
          welcome back,
          <span className='text-2xl capitalize'> {`${user?.first_name}`}</span>
        </h2>
      </div>
    </div>
  );
};

export default Header;
