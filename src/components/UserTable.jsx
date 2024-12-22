import PropTypes from 'prop-types';
import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';

const UserTable = (props) => {
  const { columns, data, route, rowKey = 'user_id', allowClick = true } = props;
  const navigate = useNavigate();
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ position: ['bottomCenter'], pageSize: 15 }}
      rowKey={rowKey}
      onRow={(record) => {
        return {
          onClick: () => {
            if (!allowClick) return;
            const linkTo = `${route}${record[rowKey]}`;
            navigate(linkTo);
          },
        };
      }}
      scroll={{ x: 'max-content' }}
    />
  );
};

UserTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  route: PropTypes.string,
  rowKey: PropTypes.string,
  allowClick: PropTypes.bool,
};

export default UserTable;
