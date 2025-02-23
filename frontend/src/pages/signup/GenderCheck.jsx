import React from 'react';

const GenderCheck = ({ onCheckboxChange, selectedGender }) => {
  return (
    <div className="flex justify-between gap-4 mt-4">
      {/* Male Button */}
      <button
        type="button" // Prevents form submission
        className={`w-1/2 py-2 rounded-lg text-white font-semibold transition-all duration-300 ${
          selectedGender === 'male'
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-gray-700 hover:bg-gray-600'
        }`}
        onClick={() => onCheckboxChange('male')}
      >
        Male
      </button>

      {/* Female Button */}
      <button
        type="button" // Prevents form submission
        className={`w-1/2 py-2 rounded-lg text-white font-semibold transition-all duration-300 ${
          selectedGender === 'female'
            ? 'bg-pink-500 hover:bg-pink-600'
            : 'bg-gray-700 hover:bg-gray-600'
        }`}
        onClick={() => onCheckboxChange('female')}
      >
        Female
      </button>
    </div>
  );
};

export default GenderCheck;
