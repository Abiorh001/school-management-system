import { Button } from 'antd';
import { CgSearch } from 'react-icons/cg';

const Search = () => {
  return (
    <div className='md:w-1/2'>
      <form className='flex gap-1 items-center'>
        <label
          htmlFor='search'
          className='flex border items-center gap-2 p-2 rounded-lg w-3/4 bg-white'
        >
          <CgSearch />
          <input
            type='search'
            name=''
            id=''
            className='focus-within:outline-none placeholder:capitalize w-full'
            placeholder='search'
          />
        </label>
        <Button className=''>search</Button>
      </form>
    </div>
  );
};

export default Search;
