import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  useEffect(() => {
    // Clear the token and any other user data stored in localStorage
    localStorage.clear();  // This will remove all stored items
  }, []);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/register");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between  bg-white rounded-lg p-8 shadow-lg m-8 transform transition duration-500 hover:scale-105">
        <div className="md:w-1/2 text-gray-800">
          <h1 className="text-4xl font-bold mb-4 text-center md:text-left animate-fade-in">
            Effortless Shift Planning, Across Time Zones
          </h1>
          <p className="text-lg mb-6 text-center md:text-left animate-fade-in animation-delay-300">
            Streamline your scheduling process and empower your team with our
            intuitive shift planning system.
          </p>

          <div className="flex justify-center md:justify-start mt-4">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transform transition duration-300 hover:scale-110"
              onClick={handleButtonClick}
            >
              Let's Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
