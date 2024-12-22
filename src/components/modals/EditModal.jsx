import { Modal } from 'antd';
import PropTypes from 'prop-types';

const EditModal = ({ children, isModalOpen, handleSubmit, handleClose }) => {
  return (
    <Modal
      open={isModalOpen}
      okButtonProps={{ htmlType: 'submit', className: 'text-black' }}
      onOk={handleSubmit}
      onCancel={handleClose}
    >
      {children}
    </Modal>
  );
};

EditModal.propTypes = {
  children: PropTypes.node,
  isModalOpen: PropTypes.bool,
  handleSubmit: PropTypes.func,
  handleClose: PropTypes.func,
};

export default EditModal;
