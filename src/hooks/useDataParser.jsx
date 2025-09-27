import { useState, useCallback } from 'react';
import Papa from 'papaparse';

const useDataParser = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const parseFile = useCallback((file) => {
    if (!file) return;

    setLoading(true);
    
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          // Filter out comment lines (starting with #)
          const dataRows = results.data.filter(row => 
            !row[0]?.toString().startsWith('#')
          );
          
          if (dataRows.length < 2) {
            throw new Error('Not enough data rows');
          }

          // First row is headers
          const headers = dataRows[0];
          const rows = dataRows.slice(1);

          // Find Time column index
          const timeIndex = headers.findIndex(h => 
            h?.toLowerCase().includes('time') && !h?.toLowerCase().includes('offset')
          );
          
          if (timeIndex === -1) {
            throw new Error('Time column not found');
          }

          // Parse data
          const parsedData = {
            headers,
            time: rows.map(row => parseFloat(row[timeIndex])).filter(t => !isNaN(t)),
            channels: {}
          };

          // Channel categories for better organization
          const channelCategories = {
            eeg: ['Fz', 'Cz', 'P3', 'C3', 'F3', 'F4', 'C4', 'P4', 'Fp1', 'Fp2', 'T3', 'T4', 'T5', 'T6', 'O1', 'O2', 'F7', 'F8', 'A1', 'A2', 'Pz'],
            ecg: ['X1:LEOG', 'X2:REOG'],
            reference: ['CM']
          };

          // Extract relevant channels
          headers.forEach((header, index) => {
            if (index === timeIndex) return;
            
            const headerStr = header?.toString() || '';
            
            // Skip unwanted columns
            if (headerStr.includes('X3:') || 
                headerStr.toLowerCase().includes('trigger') ||
                headerStr.toLowerCase().includes('offset') ||
                headerStr.toLowerCase().includes('adc') ||
                headerStr.toLowerCase().includes('event') ||
                headerStr.toLowerCase().includes('comment')) {
              return;
            }

            // Include EEG, ECG, and CM channels
            if (channelCategories.eeg.includes(headerStr) ||
                channelCategories.ecg.includes(headerStr) ||
                channelCategories.reference.includes(headerStr)) {
              
              const values = rows.map(row => parseFloat(row[index])).filter(v => !isNaN(v));
              if (values.length > 0) {
                parsedData.channels[headerStr] = values;
              }
            }
          });

          setData(parsedData);
        } catch (error) {
          console.error('Error parsing CSV:', error);
          alert('Error parsing CSV file. Please check the format.');
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        console.error('Papa Parse error:', error);
        alert('Error reading file');
        setLoading(false);
      }
    });
  }, []);

  return { data, loading, parseFile };
};

export default useDataParser;