import {  ResponsiveContainer, AreaChart, Area } from 'recharts';

  // Component for individual sensor card
  const SensorCard = ({ sensor, compact = false }) => {
    const IconComponent = sensor.icon;
    const isBoolean = sensor.type === 'M' || sensor.type === 'D';
    
    return (
      <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${compact ? 'p-4' : 'p-6'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div 
              className={`${compact ? 'p-2' : 'p-3'} rounded-lg`}
              style={{ backgroundColor: `${sensor.color}15`, color: sensor.color }}
            >
              <IconComponent size={compact ? 20 : 24} />
            </div>
            <div>
              <h3 className={`font-semibold text-gray-800 ${compact ? 'text-sm' : ''}`}>{sensor.name}</h3>
              <p className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'}`}>Cụm {sensor.cluster}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`font-bold ${compact ? 'text-lg' : 'text-2xl'}`} style={{ color: sensor.color }}>
              {isBoolean ? (sensor.currentValue == 1 ? 'ON' : 'OFF') : sensor.currentValue}
            </div>
            {!isBoolean && <div className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'}`}>{sensor.unit}</div>}
          </div>
        </div>

        <div className={`text-gray-400 mb-3 ${compact ? 'text-xs' : 'text-xs'}`}>
          Cập nhật: {sensor.lastUpdate?.toLocaleTimeString()}
        </div>

        {!isBoolean && sensor.history.length > 0 && (
          <div className={compact ? 'h-16' : 'h-20'}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sensor.history}>
                <defs>
                  <linearGradient id={`gradient-${sensor.cluster}-${sensor.type}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={sensor.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={sensor.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={sensor.color} 
                  strokeWidth={2}
                  fill={`url(#gradient-${sensor.cluster}-${sensor.type})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {isBoolean && (
          <div className={`flex items-center justify-center ${compact ? 'h-16' : 'h-20'}`}>
            <div 
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                sensor.currentValue == 1 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {sensor.currentValue == 1 
                ? (sensor.type === 'M' ? 'Có chuyển động' : 'Cửa mở') 
                : (sensor.type === 'M' ? 'Không có chuyển động' : 'Cửa đóng')}
            </div>
          </div>
        )}
      </div>
    );
  };

export default SensorCard;