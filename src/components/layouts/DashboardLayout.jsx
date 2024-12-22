import { Outlet } from 'react-router-dom';
import Sidebar from '../headers/dashboard/Sidebar';

const DashboardLayout = () => {
  return (
    <main className=' md:flex md:h-screen md:overflow-hidden relative'>
      <Sidebar />
      <section className='md:overflow-y-scroll hide-scrollbar w-full md:px-10 py-8 bg-background relative px-5'>
        <Outlet />
      </section>
    </main>
  );
};

export default DashboardLayout;
