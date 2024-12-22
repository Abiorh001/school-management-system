import PropTypes from 'prop-types';

const Button = (props) => {
  const { children, type = 'button', ...others } = props;
  return (
    <button type={type} {...others}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
};

export default Button;
