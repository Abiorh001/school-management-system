import { motion } from 'framer-motion';
import Button from '../../../components/Button';

const Hero = () => {
  return (
    <div className='lg:py-10 bg-header flex flex-col  relative mask bg-[url("../src/assets/student.png")] bg-contain bg-no-repeat mb-10 py-5'>
      <div className=' md:px-24 flex flex-col justify-center items-center md:p-16 md:bg-[url("../src/assets/girl.png")] bg-contain bg-right-bottom bg-no-repeat'>
        <motion.h1
          initial={{ opacity: 0, x: '20%' }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 2 }}
          className='text-2xl font-bold md:text-4xl mb-5 lg:text-6xl text-cm-orange-100 text-center tracking-wide capitalize leading-9 '
        >
          online school management web application
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: '-10%' }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className='max-w-4xl py-4 text-xl text-center text-white'
        >
          smartEdConnect is meticulously crafted to assist you in efficiently
          managing your school information, ensuring a seamless transition to a
          digital environment
        </motion.p>

        <Button
          className={
            'bg-light rounded-3xl py-2 capitalize  text-2xl my-5 self-center w-fit px-9'
          }
        >
          get started
        </Button>
      </div>

      <div className='md:w-1/2 px-10 md:px-16 h-28'></div>
    </div>
  );
};

export default Hero;
