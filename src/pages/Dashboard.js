import React, { useState, useEffect } from 'react';
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
  Filter,
  Grid3x3,
  List,
  ChevronDown,
  Map, ChartLine
} from 'lucide-react';
import SensorCard from '../components/SensorCard';
import StatsOverview from '../components/StatsOverview';
import MapView from '../components/MapView';
import DetailChart from '../components/DetailChart';
import TableView from '../components/TableView';

const IoTDashboard = () => {
  const [sensorData, setSensorData] = useState({});
  const [isConnected, setIsConnected] = useState(true);
  const [selectedSensorTypes, setSelectedSensorTypes] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'chart', or 'map'
  const [showFilters, setShowFilters] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Định nghĩa các loại cảm biến
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

  // Kiểm tra kết nối SSE
  useEffect(() => {
    const SSE_ENDPOINT = 'http://localhost:8000/events';
    const connectSSE = () => {
      const eventSource = new EventSource(SSE_ENDPOINT);
      eventSource.onopen = () => {
        console.log('SSE connection opened');
        setIsConnected(true);
      };
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Validate data format
          if (!data.cluster || !data.sensor || data.value === undefined || !data.timestamp) {
            console.warn('Invalid data format:', data);
            return;
          }
          
          const { cluster, sensor, value, timestamp } = data;
          const key = `${cluster}_${sensor}`;
          const timestampObj = new Date(timestamp);
          
          setSensorData(prev => {
            const existing = prev[key] || { 
              cluster, 
              type: sensor, 
              ...sensorTypes[sensor],
              history: [] 
            };
            
            const newHistory = [...existing.history, { 
              time: timestampObj.toLocaleTimeString(), 
              value: parseFloat(value),
              timestamp: timestampObj 
            }].slice(-20);
            
            return {
              ...prev,
              [key]: {
                ...existing,
                currentValue: value,
                history: newHistory,
                lastUpdate: timestampObj
              }
            };
          });
          
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      };
      
      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        setIsConnected(false);
        
        // Auto-reconnect after 5 seconds
        setTimeout(() => {
          console.log('Attempting to reconnect SSE...');
          eventSource.close();
          connectSSE();
        }, 5000);
      };
      
      return eventSource;
    };
    
    const eventSource = connectSSE();
    setSelectedSensorTypes(Object.keys(sensorTypes));
    
    return () => {
      if (eventSource) {
        eventSource.close();
        setIsConnected(false);
      }
    };
  }, []);

  const clusters = [...new Set(Object.values(sensorData).map(s => s.cluster))];
  
  // Lọc dữ liệu theo loại cảm biến được chọn
  const filteredData = Object.values(sensorData).filter(sensor => 
    selectedSensorTypes.length === 0 || selectedSensorTypes.includes(sensor.type)
  );

  // Group data by cluster
  const dataByCluster = clusters.reduce((acc, cluster) => {
    acc[cluster] = filteredData.filter(sensor => sensor.cluster === cluster);
    return acc;
  }, {});

  const toggleSensorType = (type) => {
    setSelectedSensorTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const selectAllSensorTypes = () => {
    setSelectedSensorTypes(Object.keys(sensorTypes));
  };

  const clearAllSensorTypes = () => {
    setSelectedSensorTypes([]);
  };

  return (
    <div className={`${viewMode === 'map' ? 'h-screen flex flex-col' : 'min-h-screen'} bg-gradient-to-br from-blue-50 to-indigo-100`}>
      {/* Mobile-First Header */}
      <div className="bg-white shadow-lg sticky top-0 z-50 flex-shrink-0">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="text-blue-600" size={28} />
              <h1 className="text-xl font-bold text-gray-800">IoT Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="text-green-500" size={20} />
              ) : (
                <WifiOff className="text-red-500" size={20} />
              )}
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Filter size={16} />
              <span className="text-sm font-medium">Bộ lọc</span>
              <ChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                title="Lưới"
              >
                <Grid3x3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                title="Danh sách"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'chart' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                title="Danh sách"
              >
                <ChartLine size={16} />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                title="Bản đồ"
              >
                <Map size={16} />
              </button>
            </div>
          </div>

          {/* Filter Panel - Chỉ hiện khi không phải map mode hoặc khi showFilters = true */}
          {showFilters && viewMode !== 'map' && viewMode !=='chart' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Chọn loại cảm biến</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={selectAllSensorTypes}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Chọn tất cả
                  </button>
                  <button
                    onClick={clearAllSensorTypes}
                    className="text-xs bg-gray-600 text-white px-3 py-1 rounded"
                  >
                    Bỏ chọn
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {Object.entries(sensorTypes).map(([type, config]) => {
                  const IconComponent = config.icon;
                  const isSelected = selectedSensorTypes.includes(type);
                  
                  return (
                    <button
                      key={type}
                      onClick={() => toggleSensorType(type)}
                      className={`flex items-center space-x-2 p-2 rounded-lg border-2 transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent size={16} />
                      <span className="text-xs font-medium truncate">{config.name}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 text-xs text-gray-600">
                Đã chọn: {selectedSensorTypes.length}/{Object.keys(sensorTypes).length} loại cảm biến
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'map' ? (
        <div className="flex-1 overflow-hidden">
          <MapView />
        </div>
      ) : (
        // Grid/List View - Layout bình thường với padding
        <div className="px-4 py-4">
          {/* <StatsOverview sensorData={sensorData} clusters={clusters} notifications={notifications} isConnected={isConnected}/> */}
          
          {/* Cluster-based Data Display */}
          {
            viewMode === 'chart' ? (<DetailChart sensorData={sensorData}/>) : viewMode ==='list' ? (<TableView sensorData={sensorData} selectedSensorTypes={selectedSensorTypes}/>) : (
              <>
               {clusters.map(cluster => {
                const clusterData = dataByCluster[cluster];
                if (!clusterData || clusterData.length === 0) return null;

                return (
                  <div key={cluster} className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">
                        Cụm {cluster}
                      </h2>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {clusterData.length} cảm biến
                      </span>
                    </div>

                    <div className={
                      viewMode === 'grid' 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
                        : "space-y-4"
                    }>
                      {clusterData.map(sensor => (
                        <SensorCard 
                          key={`${sensor.cluster}_${sensor.type}`} 
                          sensor={sensor} 
                          compact={viewMode === 'chart'} 
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {filteredData.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">Không có dữ liệu</div>
                  <div className="text-gray-500 text-sm">Vui lòng chọn ít nhất một loại cảm biến</div>
                </div>
              )}
              </>
            )
          }
        </div>
      )}
    </div>
  );
};

export default IoTDashboard;