import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const PRCurve = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); 

  useEffect(() => {
    if (chartInstanceRef.current) {
    
      chartInstanceRef.current.destroy();
    }

    const chartData = {
      labels: data.map((row) => row.recall),
      datasets: [
        {
          label: 'P-R Curve',
          data: data.map((row) => row.precision),
          borderColor: 'indianred',
          backgroundColor: 'indianred',
          borderWidth: 2,
          pointRadius: 4,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          min: 0,
          max: 1,
          title: {
            display: true,
            text: 'Recall',
            color: '#7cfc00',
            font: {
                size: 17 
              },
          },
          grid: {
            color: 'rgba(255, 99, 132, 0.2)',
          },

          ticks: {
            color: '#00EFFE',
            font: {
                size: 14, 
              },
          },
        },
        y: {
          min: 0,
          max: 1,
          title: {
            display: true,
            text: 'Precision',
            color: '#7cfc00',
            font: {
                size: 17 
              },
          },
          grid: {
            color: 'rgba(255, 99, 132, 0.2)',
          },
          ticks: {
            color: '#00EFFE',
            font: {
                size: 14, 
              },
          },
        },
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: 'white',
          },
        },
      },
    };

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions,
    });
  }, [data]);

  return (
    <div className="container mx-auto my-8 text-white">
      <div className="ml-8">
        <canvas ref={chartRef} width="900" height="500" style={{ borderRadius: '8px' }}></canvas>
      </div>
    </div>
  );
};

export default PRCurve;
