import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Sun, 
  Wind, 
  Activity, 
  DoorOpen,
  Gauge,
  Eye,
  Waves
} from 'lucide-react';

const TableView = ({ sensorData, selectedSensorTypes }) => {
  // Định nghĩa các loại cảm biến (giống với component chính)
  const sensorTypes = {
    'T': { name: 'Nhiệt độ', unit: '°C', icon: Thermometer, color: '#ef4444' },
    'H': { name: 'Độ ẩm', unit: '%', icon: Droplets, color: '#3b82f6' },
    'L': { name: 'Ánh sáng', unit: 'lux', icon: Sun, color: '#f59e0b' },
    'PH': { name: 'Độ PH', unit: 'pH', icon: Waves, color: '#8b5cf6' },
    'EC': { name: 'Độ EC', unit: 'ms/cm', icon: Activity, color: '#06b6d4' },
    'DO': { name: 'Độ DO', unit: 'mg/L', icon: Droplets, color: '#10b981' },
    'P': { name: 'Áp suất', unit: 'Pa', icon: Gauge, color: '#f97316' },
    'W': { name: 'Tốc độ gió', unit: 'm/s', icon: Wind, color: '#84cc16' },
    'M': { name: 'Chuyển động', unit: '', icon: Eye, color: '#ec4899' },
    'D': { name: 'Cửa', unit: '', icon: DoorOpen, color: '#6366f1' }
  };

  // Lọc dữ liệu theo loại cảm biến được chọn
  const filteredData = Object.values(sensorData).filter(sensor => 
    selectedSensorTypes.length === 0 || selectedSensorTypes.includes(sensor.type)
  );

  // Lấy danh sách các cụm
  const clusters = [...new Set(filteredData.map(s => s.cluster))].sort();
  
  // Lấy danh sách các loại cảm biến đã được lọc và có trong dữ liệu
  const availableSensorTypes = [...new Set(filteredData.map(s => s.type))]
    .filter(type => selectedSensorTypes.includes(type))
    .sort();

  // Tạo ma trận dữ liệu: cluster x sensor type
  const tableData = clusters.map(cluster => {
    const clusterSensors = filteredData.filter(s => s.cluster === cluster);
    const row = { cluster };
    
    availableSensorTypes.forEach(type => {
      const sensor = clusterSensors.find(s => s.type === type);
      row[type] = sensor || null;
    });
    
    return row;
  });

  const formatValue = (sensor) => {
    if (!sensor) return '-';
    
    const isBoolean = sensor.type === 'M' || sensor.type === 'D';
    if (isBoolean) {
      return sensor.currentValue == 1 ? 'ON' : 'OFF';
    }
    
    return `${sensor.currentValue} ${sensor.unit}`;
  };

  const getStatusColor = (sensor) => {
    if (!sensor) return 'text-gray-400';
    
    const isBoolean = sensor.type === 'M' || sensor.type === 'D';
    if (isBoolean) {
      return sensor.currentValue == 1 ? 'text-green-600' : 'text-gray-600';
    }
    
    return 'text-gray-800';
  };

  const getLastUpdate = (sensor) => {
    if (!sensor || !sensor.lastUpdate) return '-';
    return sensor.lastUpdate.toLocaleTimeString();
  };

  if (filteredData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">Không có dữ liệu</div>
        <div className="text-gray-500 text-sm">Vui lòng chọn ít nhất một loại cảm biến</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <th className="px-6 py-4 text-left font-semibold">Cụm</th>
              {availableSensorTypes.map(type => {
                const config = sensorTypes[type];
                const IconComponent = config.icon;
                return (
                  <th key={type} className="px-6 py-4 text-center font-semibold min-w-[120px]">
                    <div className="flex flex-col items-center space-y-1">
                      <IconComponent size={18} />
                      <span className="text-xs">{config.name}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={row.cluster} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                <td className="px-6 py-4 font-semibold text-blue-600 border-r border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span>Cụm {row.cluster}</span>
                  </div>
                </td>
                {availableSensorTypes.map(type => {
                  const sensor = row[type];
                  const config = sensorTypes[type];
                  
                  return (
                    <td key={type} className="px-6 py-4 text-center border-r border-gray-100">
                      {sensor ? (
                        <div className="space-y-1">
                          <div 
                            className={`font-semibold text-lg ${getStatusColor(sensor)}`}
                            style={{ color: sensor ? config.color : undefined }}
                          >
                            {formatValue(sensor)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getLastUpdate(sensor)}
                          </div>
                          {sensor && sensor.history && sensor.history.length > 0 && (
                            <div className="flex items-center justify-center space-x-1 text-xs">
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: config.color }}
                              ></div>
                              <span className="text-gray-400">Live</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm">
                          <div>-</div>
                          <div className="text-xs">Không có dữ liệu</div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer với thông tin tổng quan */}
      <div className="bg-gray-100 px-6 py-3 border-t">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Tổng số cụm: {clusters.length}</span>
          <span>Loại cảm biến: {availableSensorTypes.length}</span>
          <span>Tổng số cảm biến: {filteredData.length}</span>
        </div>
      </div>
    </div>
  );
};

export default TableView;