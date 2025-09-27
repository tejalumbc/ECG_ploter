import React from 'react';

const ChannelSelection = ({ 
  data, 
  selectedChannels, 
  onToggleChannel, 
  channelCategories 
}) => {
  if (!data) return null;

  return (
    <div className="channel-selection">
      <h3>Select Channels to Display:</h3>
      
      <div className="channel-groups">
        <div className="channel-group">
          <h4>EEG Channels (μV)</h4>
          <div className="channel-checkboxes">
            {channelCategories.eeg.map(channel => 
              data.channels[channel] && (
                <label key={channel} className="channel-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedChannels[channel] || false}
                    onChange={() => onToggleChannel(channel)}
                  />
                  {channel}
                </label>
              )
            )}
          </div>
        </div>

        <div className="channel-group">
          <h4>ECG Channels (mV)</h4>
          <div className="channel-checkboxes">
            {channelCategories.ecg.map(channel => 
              data.channels[channel] && (
                <label key={channel} className="channel-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedChannels[channel] || false}
                    onChange={() => onToggleChannel(channel)}
                  />
                  {channel}
                </label>
              )
            )}
          </div>
        </div>

        <div className="channel-group">
          <h4>Reference</h4>
          <div className="channel-checkboxes">
            {channelCategories.reference.map(channel => 
              data.channels[channel] && (
                <label key={channel} className="channel-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedChannels[channel] || false}
                    onChange={() => onToggleChannel(channel)}
                  />
                  {channel}
                </label>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelSelection;