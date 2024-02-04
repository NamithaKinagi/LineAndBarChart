import React, { useState, useEffect } from 'react';
import EchartsReact from 'echarts-for-react';
import ChartSelector from './components/ChartSelector';
import jsonData from './gemini_BTCUSD_2020_1min.json';

const App = () => {
  const [data, setData] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('Open');
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    const fetchData = async () => {
      setData(jsonData);
    };

    fetchData();
  }, []);

  const handleColumnChange = (column) => {
    setSelectedColumn(column);
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  const getChartOption = () => {
    if (chartType === 'line') {
      const xAxisData = data.map((item) => item.Date); 
      const seriesData = data.map((item) => item[selectedColumn]);
      return {
        xAxis: {
          type: 'category',
          data: xAxisData,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            type: 'line',
            data: seriesData,
            smooth: true,
          },
        ],
        tooltip: {
          trigger: 'axis',
        },
      };
    } else if (chartType === 'bar') {
      const parseAndFormatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1; 
        const year = date.getFullYear();
        return `${month}/${year}`;
      };
    
      const monthYearsSet = new Set(data.map((item) => parseAndFormatDate(item.Date)));
      const monthYears = Array.from(monthYearsSet).sort((a, b) => {
        const [aMonth, aYear] = a.split('/').map(Number);
        const [bMonth, bYear] = b.split('/').map(Number);
    
        if (aYear !== bYear) {
          return bYear - aYear; 
        }
    
        return bMonth - aMonth; 
      });
      const groupedData = new Map(monthYears.map((monthYear) => [monthYear, { sum: 0, count: 0 }]));
    
      data.forEach((item) => {
        const monthYear = parseAndFormatDate(item.Date);
        const numericValue = parseFloat(item[selectedColumn]);
    
        if (!isNaN(numericValue)) {
          groupedData.get(monthYear).sum += numericValue;
          groupedData.get(monthYear).count++;
        }
      });
    
      const barData = monthYears.map((monthYear) => {
        const { sum, count } = groupedData.get(monthYear);
        const averageValue = count ? sum / count : 0;
        return { value: averageValue, monthYear };
      });
    
      return {
        xAxis: {
          type: 'category',
          data: monthYears,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            type: 'bar',
            data: barData,
          },
        ],
        tooltip: {
          trigger: 'axis',
        },
      };
    }
    return {};
  };

  return (
    <div className="app-container">
      <h1 >Time Series Data Visualization</h1>
      <ChartSelector
        selectedColumn={selectedColumn}
        onColumnChange={handleColumnChange}
        chartType={chartType}
        onChartTypeChange={handleChartTypeChange}
      />
      <EchartsReact
        option={getChartOption()}
        style={{ height: '400px', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
};

export default App;
