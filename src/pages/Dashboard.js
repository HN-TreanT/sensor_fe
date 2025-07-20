import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Thermometer, 
  Droplets, 
  Sun, 
  Wind, 
  Activity, 
  DoorOpen,
  Gauge,
  Eye,
  Waves,
  BarChart3,
  Wifi,
  WifiOff,
  Bell
} from 'lucide-react';
import SensorCard from '../components/SensorCard';
import Notification from '../components/Notification';
import StatsOverview from '../components/StatsOverview';
import Header from '../components/Header';

const IoTDashboard = () => {
  const [sensorData, setSensorData] = useState({});
  const [isConnected, setIsConnected] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState('all');
  const [notifications, setNotifications] = useState([]);

  // Mô phỏng dữ liệu MQTT
  useEffect(() => {
    const simulateMQTTData = () => {
      const clusters = ['001', '002', '003'];
      const sensorTypes = {
        'T': { name: 'Nhiệt độ', unit: '°C', min: 20, max: 40, icon: Thermometer, color: '#ef4444' },
        'H': { name: 'Độ ẩm', unit: '%', min: 40, max: 90, icon: Droplets, color: '#3b82f6' },
        'L': { name: 'Ánh sáng', unit: 'lux', min: 100, max: 1000, icon: Sun, color: '#f59e0b' },
        'PH': { name: 'Độ PH', unit: 'pH', min: 6, max: 8, icon: Waves, color: '#8b5cf6' },
        'EC': { name: 'Độ EC', unit: 'ms/cm', min: 1, max: 3, icon: Activity, color: '#06b6d4' },
        'DO': { name: 'Độ DO', unit: 'mg/L', min: 5, max: 15, icon: Droplets, color: '#10b981' },
        'P': { name: 'Áp suất', unit: 'Pa', min: 1000, max: 1100, icon: Gauge, color: '#f97316' },
        'W': { name: 'Tốc độ gió', unit: 'm/s', min: 0, max: 20, icon: Wind, color: '#84cc16' },
        'M': { name: 'Chuyển động', unit: '', min: 0, max: 1, icon: Eye, color: '#ec4899' },
        'D': { name: 'Cửa', unit: '', min: 0, max: 1, icon: DoorOpen, color: '#6366f1' }
      };

      clusters.forEach(cluster => {
        Object.keys(sensorTypes).forEach(sensorType => {
          const { min, max } = sensorTypes[sensorType];
          let value;
          
          if (sensorType === 'M' || sensorType === 'D') {
            value = Math.random() > 0.8 ? 1 : 0;
          } else {
            value = (Math.random() * (max - min) + min).toFixed(sensorType === 'PH' ? 1 : 0);
          }

          const timestamp = new Date();
          const key = `${cluster}_${sensorType}`;

          setSensorData(prev => {
            const existing = prev[key] || { 
              cluster, 
              type: sensorType, 
              ...sensorTypes[sensorType],
              history: [] 
            };
            
            const newHistory = [...existing.history, { 
              time: timestamp.toLocaleTimeString(), 
              value: parseFloat(value),
              timestamp 
            }].slice(-20);

            return {
              ...prev,
              [key]: {
                ...existing,
                currentValue: value,
                history: newHistory,
                lastUpdate: timestamp
              }
            };
          });
        });
      });
    };

    simulateMQTTData();
    const interval = setInterval(simulateMQTTData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Kiểm tra cảnh báo
  // useEffect(() => {
  //   Object.values(sensorData).forEach(sensor => {
  //     const value = parseFloat(sensor.currentValue);
  //     let isAlert = false;
  //     let message = '';

  //     if (sensor.type === 'T' && (value > 35 || value < 22)) {
  //       isAlert = true;
  //       message = `Nhiệt độ bất thường ở cụm ${sensor.cluster}: ${value}°C`;
  //     } else if (sensor.type === 'PH' && (value > 7.5 || value < 6.5)) {
  //       isAlert = true;
  //       message = `Độ PH bất thường ở cụm ${sensor.cluster}: ${value}`;
  //     }

  //     if (isAlert) {
  //       setNotifications(prev => {
  //         const exists = prev.some(n => n.sensor === `${sensor.cluster}_${sensor.type}`);
  //         if (!exists) {
  //           return [...prev.slice(-4), {
  //             id: Date.now(),
  //             message,
  //             sensor: `${sensor.cluster}_${sensor.type}`,
  //             time: new Date().toLocaleTimeString()
  //           }];
  //         }
  //         return prev;
  //       });
  //     }
  //   });
  // }, [sensorData]);

  const clusters = [...new Set(Object.values(sensorData).map(s => s.cluster))];
  const filteredData = selectedCluster === 'all' 
    ? Object.values(sensorData)
    : Object.values(sensorData).filter(s => s.cluster === selectedCluster);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <Header isConnected={isConnected} notifications={notifications} selectedCluster={selectedCluster} setSelectedCluster={setSelectedCluster} clusters={clusters}/>
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Notifications */}
        {/* <Notification notifications={notifications} /> */}
      
        {/* Stats Overview */}
        <StatsOverview sensorData={sensorData} clusters={clusters} isConnected={isConnected} notifications={notifications}/>

        {/* Sensor Cards Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Dữ liệu cảm biến {selectedCluster !== 'all' ? `- Cụm ${selectedCluster}` : ''}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map(sensor => (
              <SensorCard key={`${sensor.cluster}_${sensor.type}`} sensor={sensor} />
            ))}
          </div>
        </div>

        {/* Detailed Charts */}
        {Object.values(sensorData).filter(s => s.history.length > 0 && !['M', 'D'].includes(s.type)).length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Biểu đồ chi tiết</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Object.values(sensorData)
                .filter(sensor => sensor.history.length > 0 && !['M', 'D'].includes(sensor.type))
                .slice(0, 4)
                .map(sensor => (
                <div key={`${sensor.cluster}_${sensor.type}`} className="space-y-3">
                  <h3 className="font-medium text-gray-700">
                    {sensor.name} - Cụm {sensor.cluster}
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sensor.history}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="time" 
                          stroke="#666"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#666"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: `2px solid ${sensor.color}`,
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke={sensor.color}
                          strokeWidth={3}
                          dot={{ fill: sensor.color, strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: sensor.color, strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IoTDashboard;