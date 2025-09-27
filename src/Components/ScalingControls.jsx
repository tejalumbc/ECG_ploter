import React from 'react';

const ScalingControls = ({ scalingMode, onScalingModeChange }) => {
  return (
    <div className="scaling-controls">
      <label>
        Scaling Mode:
        <select 
          value={scalingMode} 
          onChange={(e) => onScalingModeChange(e.target.value)}
        >
          <option value="separate">Separate Y-Axes</option>
          <option value="normalized">Normalized</option>
        </select>
      </label>
    </div>
  );
};

export default ScalingControls;