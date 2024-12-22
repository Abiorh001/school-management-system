import { motion, useInView, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const ScrollAnimate = (props) => {
  const { children, variants, ...others } = props;
  const ref = useRef(null);
  const elementInView = useInView(ref, { amount: 0.1 });

  const mainControls = useAnimation();

  useEffect(() => {
    if (elementInView) {
      mainControls.start('visible');
    }
  }, [elementInView]);

  return (
    <motion.section
      ref={ref}
      initial='hidden'
      variants={variants}
      animate={mainControls}
      transition={{ duration: 0.5, delay: 0.25 }}
      {...others}
    >
      {children}
    </motion.section>
  );
};

ScrollAnimate.propTypes = {
  children: PropTypes.node,
  variants: PropTypes.object,
};

export default ScrollAnimate;
