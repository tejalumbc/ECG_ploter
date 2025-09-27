import React, { useState, useCallback } from 'react';
import Header from './Components/Header';
import FileUpload from './Components/FileUpload';
import ScalingControls from './Components/ScalingControls';
import ChannelSelection from './Components/ChannelSelection';
import PlotContainer from './Components/PlotContainer';
import Instructions from './Components/Instructions';
import useDataParser from './hooks/useDataParser';
import usePlotData from './hooks/UsePlotData';
import './App.css';

function App() {
  const { data, loading, parseFile } = useDataParser();
  const [selectedChannels, setSelectedChannels] = useState({});
  const [scalingMode, setScalingMode] = useState('separate');

  const { plotData, plotLayout, config, channelCategories } = usePlotData(
    data, 
    selectedChannels, 
    scalingMode
  );

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      parseFile(file);
      
      // Initialize selected channels after parsing
      setTimeout(() => {
        const initialSelection = {};
        ['Fz', 'Cz', 'X1:LEOG', 'X2:REOG', 'CM'].forEach(channel => {
          if (data?.channels[channel]) {
            initialSelection[channel] = true;
          }
        });
        setSelectedChannels(initialSelection);
      }, 100);
    }
  }, [parseFile, data]);

  const toggleChannel = useCallback((channel) => {
    setSelectedChannels(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
  }, []);

  // Initialize selected channels when data is loaded
  React.useEffect(() => {
    if (data && Object.keys(selectedChannels).length === 0) {
      const initialSelection = {};
      ['Fz', 'Cz', 'X1:LEOG', 'X2:REOG', 'CM'].forEach(channel => {
        if (data.channels[channel]) {
          initialSelection[channel] = true;
        }
      });
      setSelectedChannels(initialSelection);
    }
  }, [data, selectedChannels]);

  return (
    <div className="app">
      <Header />

      <div className="controls">
        <FileUpload onFileUpload={handleFileUpload} loading={loading} />
        {data && (
          <ScalingControls 
            scalingMode={scalingMode} 
            onScalingModeChange={setScalingMode} 
          />
        )}
      </div>

      <ChannelSelection
        data={data}
        selectedChannels={selectedChannels}
        onToggleChannel={toggleChannel}
        channelCategories={channelCategories}
      />

      {data && (
        <PlotContainer
          plotData={plotData}
          plotLayout={plotLayout}
          config={config}
        />
      )}

      <Instructions />
    </div>
  );
}

export default App;