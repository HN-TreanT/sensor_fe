import { Wifi, Bell, WifiOff, BarChart3 } from "lucide-react";

const StatsOverview = ({ sensorData, clusters = [], notifications = [], isConnected}) => {
  return           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Tổng cảm biến</p>
                <p className="text-2xl font-bold">{Object.keys(sensorData).length}</p>
              </div>
              <BarChart3 className="text-blue-200" size={24} />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Cụm hoạt động</p>
                <p className="text-2xl font-bold">{clusters.length}</p>
              </div>
              <Wifi className="text-green-200" size={24} />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Cảnh báo</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <Bell className="text-yellow-200" size={24} />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Trạng thái</p>
                <p className="text-lg font-bold">{isConnected ? 'Online' : 'Offline'}</p>
              </div>
              {isConnected ? (
                <Wifi className="text-purple-200" size={24} />
              ) : (
                <WifiOff className="text-purple-200" size={24} />
              )}
            </div>
          </div>
        </div>

}

export default StatsOverview;