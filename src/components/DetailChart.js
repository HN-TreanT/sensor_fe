import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const DetailChart = ({ sensorData }) => {
    return <>
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
    </>
}

export default DetailChart;