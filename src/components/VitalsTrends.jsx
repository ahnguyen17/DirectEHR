import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function VitalsTrends({ vitals }) {
  const [chartData, setChartData] = useState({
    bp: { labels: [], systolic: [], diastolic: [] },
    pulse: { labels: [], data: [] },
    temp: { labels: [], data: [] },
    weight: { labels: [], data: [] },
    bmi: { labels: [], data: [] }
  });

  useEffect(() => {
    if (vitals && vitals.length > 0) {
      // Sort vitals by date (oldest to newest)
      const sortedVitals = [...vitals].sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Format dates for display
      const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };

      // Extract data for each chart
      const labels = sortedVitals.map(v => formatDate(v.date));
      
      // Blood pressure data
      const systolicValues = [];
      const diastolicValues = [];
      
      sortedVitals.forEach(vital => {
        if (vital.bp) {
          const [systolic, diastolic] = vital.bp.split('/').map(v => parseInt(v.trim()));
          systolicValues.push(systolic);
          diastolicValues.push(diastolic);
        } else {
          systolicValues.push(null);
          diastolicValues.push(null);
        }
      });

      // Other vitals data
      const pulseData = sortedVitals.map(v => v.pulse);
      const tempData = sortedVitals.map(v => v.temp);
      const weightData = sortedVitals.map(v => v.weight);
      const bmiData = sortedVitals.map(v => v.bmi);

      setChartData({
        bp: { labels, systolic: systolicValues, diastolic: diastolicValues },
        pulse: { labels, data: pulseData },
        temp: { labels, data: tempData },
        weight: { labels, data: weightData },
        bmi: { labels, data: bmiData }
      });
    }
  }, [vitals]);

  // Chart options
  const bpOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Blood Pressure Trends',
      },
    },
    scales: {
      y: {
        min: 40,
        max: 200,
        title: {
          display: true,
          text: 'mmHg'
        }
      }
    }
  };

  const pulseOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Pulse Rate Trends',
      },
    },
    scales: {
      y: {
        min: 40,
        max: 120,
        title: {
          display: true,
          text: 'bpm'
        }
      }
    }
  };

  const tempOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Temperature Trends',
      },
    },
    scales: {
      y: {
        min: 96,
        max: 104,
        title: {
          display: true,
          text: '°F'
        }
      }
    }
  };

  const weightOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weight Trends',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'lbs'
        }
      }
    }
  };

  const bmiOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'BMI Trends',
      },
    },
    scales: {
      y: {
        min: 15,
        max: 40,
      }
    }
  };

  // Chart data
  const bpData = {
    labels: chartData.bp.labels,
    datasets: [
      {
        label: 'Systolic',
        data: chartData.bp.systolic,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Diastolic',
        data: chartData.bp.diastolic,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const pulseData = {
    labels: chartData.pulse.labels,
    datasets: [
      {
        label: 'Pulse Rate',
        data: chartData.pulse.data,
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
      },
    ],
  };

  const tempData = {
    labels: chartData.temp.labels,
    datasets: [
      {
        label: 'Temperature',
        data: chartData.temp.data,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const weightData = {
    labels: chartData.weight.labels,
    datasets: [
      {
        label: 'Weight',
        data: chartData.weight.data,
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ],
  };

  const bmiData = {
    labels: chartData.bmi.labels,
    datasets: [
      {
        label: 'BMI',
        data: chartData.bmi.data,
        borderColor: 'rgb(255, 205, 86)',
        backgroundColor: 'rgba(255, 205, 86, 0.5)',
      },
    ],
  };

  if (!vitals || vitals.length < 2) {
    return (
      <div className="p-6 bg-white shadow sm:rounded-lg text-center">
        <p className="text-gray-500">Not enough data to display trends. At least two vitals records are needed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blood Pressure Chart */}
        <div className="bg-white p-4 shadow sm:rounded-lg">
          <Line options={bpOptions} data={bpData} />
        </div>

        {/* Pulse Chart */}
        <div className="bg-white p-4 shadow sm:rounded-lg">
          <Line options={pulseOptions} data={pulseData} />
        </div>

        {/* Temperature Chart */}
        <div className="bg-white p-4 shadow sm:rounded-lg">
          <Line options={tempOptions} data={tempData} />
        </div>

        {/* Weight Chart */}
        <div className="bg-white p-4 shadow sm:rounded-lg">
          <Line options={weightOptions} data={weightData} />
        </div>
      </div>

      {/* BMI Chart */}
      <div className="bg-white p-4 shadow sm:rounded-lg">
        <Line options={bmiOptions} data={bmiData} />
      </div>
    </div>
  );
}
