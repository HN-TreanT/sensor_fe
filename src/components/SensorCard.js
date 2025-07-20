import {  ResponsiveContainer, AreaChart, Area } from 'recharts';
const SensorCard = ({ sensor }) => {
const IconComponent = sensor.icon;
const isBoolean = sensor.type === 'M' || sensor.type === 'D';
const statusText = isBoolean 
    ? (sensor.currentValue == 1 
        ? (sensor.type === 'M' ? 'Có chuyển động' : 'Cửa mở') 
        : (sensor.type === 'M' ? 'Không có chuyển động' : 'Cửa đóng'))
    : `${sensor.currentValue} ${sensor.unit}`;

return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
        <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${sensor.color}15`, color: sensor.color }}
        >
            <IconComponent size={24} />
        </div>
        <div>
            <h3 className="font-semibold text-gray-800">{sensor.name}</h3>
            <p className="text-sm text-gray-500">Cụm {sensor.cluster}</p>
        </div>
        </div>
        <div className="text-right">
        <div className="text-2xl font-bold" style={{ color: sensor.color }}>
            {isBoolean ? (sensor.currentValue == 1 ? 'ON' : 'OFF') : sensor.currentValue}
        </div>
        {!isBoolean && <div className="text-sm text-gray-500">{sensor.unit}</div>}
        </div>
    </div>

    <div className="text-xs text-gray-400 mb-3">
        Cập nhật: {sensor.lastUpdate?.toLocaleTimeString()}
    </div>

    {!isBoolean && sensor.history.length > 0 && (
        <div className="h-20">
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
        <div className="flex items-center justify-center h-20">
        <div 
            className={`px-4 py-2 rounded-full text-sm font-medium ${
            sensor.currentValue == 1 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}
        >
            {statusText}
        </div>
        </div>
    )}
    </div>
);
};

export default SensorCard;