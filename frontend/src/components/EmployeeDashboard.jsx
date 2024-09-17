
import EmployeeAvailability from './utility/empAvailability';
import EmployeeShifts from './utility/empShift';

const EmployeeDashboard = () => {
  return (
    <div className="container mx-auto p-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Availability</h2>
        <EmployeeAvailability />
      </div>
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Shifts</h2>
        <EmployeeShifts />
      </div>
    </div>
  </div>
  );
};

export default EmployeeDashboard;