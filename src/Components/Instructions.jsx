import React from 'react';

const Instructions = () => {
  return (
    <div className="instructions">
      <h3>Instructions:</h3>
      <ul>
        <li>Upload a CSV file with EEG/ECG data</li>
        <li>Select channels to display using the checkboxes</li>
        <li>Use the range slider at the bottom to navigate through time</li>
        <li>Click and drag to pan, use mouse wheel to zoom</li>
        <li>Choose between separate Y-axes or normalized scaling</li>
        <li>EEG channels are displayed in μV, ECG channels in mV</li>
      </ul>
    </div>
  );
};

export default Instructions;