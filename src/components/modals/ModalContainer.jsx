import PropTypes from 'prop-types';

const ModalContainer = ({ children }) => {
  return <div className=''>{children}</div>;
};

ModalContainer.propTypes = {
  children: PropTypes.element,
};

export default ModalContainer;
