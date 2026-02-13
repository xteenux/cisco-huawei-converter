
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Cisco-Huawei Converter</h1>
            <p className="text-sm text-gray-500">Convert network configurations seamlessly</p>
          </div>
        </div>
        <div className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">
          v1.0.0
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
    </header>
  );
};

export default Header;
