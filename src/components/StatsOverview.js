import { Activity, Wifi, Bell, WifiOff } from "lucide-react";

const StatsOverview = ({ sensorData, clusters = [], notifications = [], isConnected}) => {
  return   <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Tổng cảm biến</p>
                <p className="text-3xl font-bold">{Object.keys(sensorData).length}</p>
              </div>
              <Activity size={40} className="text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Cụm hoạt động</p>
                <p className="text-3xl font-bold">{clusters.length}</p>
              </div>
              <Wifi size={40} className="text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Cảnh báo</p>
                <p className="text-3xl font-bold">{notifications.length}</p>
              </div>
              <Bell size={40} className="text-yellow-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Trạng thái</p>
                <p className="text-xl font-bold">{isConnected ? 'Online' : 'Offline'}</p>
              </div>
              {isConnected ? <Wifi size={40} className="text-purple-200" /> : <WifiOff size={40} className="text-purple-200" />}
            </div>
          </div>
        </div>
}

export default StatsOverview;