
import EmployeeAvailability from './utility/empAvailability';
import EmployeeShifts from './utility/empShift';

const EmployeeDashboard = () => {
  return (
    <div>
        <div>
            {<EmployeeAvailability/>}
            {<EmployeeShifts/>}
        </div>

    </div>
  );
};

export default EmployeeDashboard;