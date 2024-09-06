// client/src/components/EmployeeDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeAvailability from './utility/empAvailability';
import EmployeeShifts from './utility/empShift';

const EmployeeDashboard = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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