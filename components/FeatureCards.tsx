
import React from 'react';
import { CONVERSION_OPTIONS } from '../constants';

const FeatureCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {CONVERSION_OPTIONS.map((option) => (
        <div key={option.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              {/* FIX: Cast the icon to a ReactElement with a className prop to satisfy TypeScript for React.cloneElement. */}
              {React.cloneElement(option.icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' })}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{option.name} Conversion</h3>
              <p className="text-sm text-gray-500">{option.description.split(' ')[1]} support</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;
