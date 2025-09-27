import { useMemo } from 'react';

const usePlotData = (data, selectedChannels, scalingMode) => {
  const channelCategories = {
    eeg: ['Fz', 'Cz', 'P3', 'C3', 'F3', 'F4', 'C4', 'P4', 'Fp1', 'Fp2', 'T3', 'T4', 'T5', 'T6', 'O1', 'O2', 'F7', 'F8', 'A1', 'A2', 'Pz'],
    ecg: ['X1:LEOG', 'X2:REOG'],
    reference: ['CM']
  };

  const plotData = useMemo(() => {
    if (!data) return [];

    const traces = [];
    const selectedChannelNames = Object.keys(selectedChannels).filter(ch => selectedChannels[ch]);
    
    selectedChannelNames.forEach((channel, index) => {
      const values = data.channels[channel];
      if (!values) return;

      let yValues = values;
      let yAxisRef = 'y';
      let name = channel;

      // Determine channel type and apply scaling
      if (channelCategories.ecg.includes(channel)) {
        // ECG channels - convert from μV to mV for display
        yValues = values.map(v => v / 1000);
        name = `${channel} (mV)`;
        yAxisRef = scalingMode === 'separate' ? 'y2' : 'y';
      } else if (channelCategories.reference.includes(channel)) {
        // CM reference channel - also large amplitude
        name = `${channel} (ref)`;
        yAxisRef = scalingMode === 'separate' ? 'y3' : 'y';
      } else {
        // EEG channels in μV
        name = `${channel} (μV)`;
        yAxisRef = 'y';
      }

      // Normalize if requested
      if (scalingMode === 'normalized') {
        const mean = yValues.reduce((a, b) => a + b, 0) / yValues.length;
        const std = Math.sqrt(yValues.reduce((a, b) => a + (b - mean) ** 2, 0) / yValues.length);
        yValues = yValues.map(v => (v - mean) / std);
        name = `${channel} (normalized)`;
        yAxisRef = 'y';
      }

      traces.push({
        x: data.time,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: name,
        yaxis: yAxisRef,
        line: {
          width: 1.5,
          color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`
        }
      });
    });

    return traces;
  }, [data, selectedChannels, scalingMode]);

  const plotLayout = useMemo(() => {
    const layout = {
      title: 'EEG/ECG Data Visualization',
      xaxis: {
        title: 'Time (seconds)',
        rangeslider: { visible: true },
        type: 'linear'
      },
      yaxis: {
        title: scalingMode === 'normalized' ? 'Normalized Amplitude' : 'EEG Amplitude (μV)',
        side: 'left'
      },
      height: 600,
      margin: { l: 80, r: 80, t: 50, b: 100 },
      showlegend: true,
      legend: {
        x: 1.05,
        y: 1,
        xanchor: 'left'
      }
    };

    if (scalingMode === 'separate') {
      layout.yaxis2 = {
        title: 'ECG Amplitude (mV)',
        side: 'right',
        overlaying: 'y',
        color: 'red'
      };
      layout.yaxis3 = {
        title: 'Reference (CM)',
        side: 'right',
        overlaying: 'y',
        position: 0.95,
        color: 'green'
      };
    }

    return layout;
  }, [scalingMode]);

  const config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToAdd: ['pan2d', 'zoom2d', 'autoScale2d', 'resetScale2d'],
    scrollZoom: true
  };

  return { plotData, plotLayout, config, channelCategories };
};

export default usePlotData;