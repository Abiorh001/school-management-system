import { Select } from 'antd';
import PropTypes from 'prop-types';
import useApiQuery from '../../hooks/useApiQuery';

const MultipleSelect = ({ selectedDepartments, setSelectedDepartments }) => {
  const { data } = useApiQuery(['departments'], 'departments/');
  const departments = data?.data;

  const options = departments?.map((department) => {
    return {
      label: department.department_name,
      value: department.department_id,
    };
  });
  return (
    <div className='w-full'>
      <label htmlFor='departments' className='capitalize'>
        departments
      </label>
      <Select
        mode='multiple'
        options={options}
        value={selectedDepartments}
        onChange={(value) => {
          setSelectedDepartments(value);
        }}
        className='input'
        allowClear
        id='departments'
        required
      />
    </div>
  );
};

MultipleSelect.propTypes = {
  selectedDepartments: PropTypes.array,
  setSelectedDepartments: PropTypes.func,
};

export default MultipleSelect;
