import { Link } from 'react-router-dom';
const Logo = () => {
  return (
    <Link className={'text-lg md:text-2xl px-5'} to={'/'}>
      smart<span>Ed</span>Connect
    </Link>
  );
};

export default Logo;
