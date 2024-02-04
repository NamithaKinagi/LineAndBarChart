import React from 'react';

const ChartSelector = ({ selectedColumn, onColumnChange, chartType, onChartTypeChange }) => {
  return (
    <div className="chart-selector">
      <select value={selectedColumn} onChange={(e) => onColumnChange(e.target.value)}>
        <option value="Open">#Open</option>
        <option value="High">#High</option>
        <option value="Low">#Low</option>
        <option value="Close">#Close</option>
        <option value="Volume">#Volume</option>
      </select>
      <div className="chart-type-toggle">
        <label>
          <input
            type="radio"
            value="line"
            checked={chartType === 'line'}
            onChange={() => onChartTypeChange('line')}
          />
          Line
        </label>
        <label>
          <input
            type="radio"
            value="bar"
            checked={chartType === 'bar'}
            onChange={() => onChartTypeChange('bar')}
          />
          Bar
        </label>
      </div>
    </div>
  );
};

export default ChartSelector;
