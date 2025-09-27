import React from 'react';
import Plot from 'react-plotly.js';

const PlotContainer = ({ plotData, plotLayout, config }) => {
  if (plotData.length === 0) {
    return (
      <div className="no-data">
        <p>No channels selected. Please select channels to display.</p>
      </div>
    );
  }

  return (
    <div className="plot-container">
      <Plot
        data={plotData}
        layout={plotLayout}
        config={config}
        style={{ width: '100%', height: '600px' }}
      />
    </div>
  );
};

export default PlotContainer;