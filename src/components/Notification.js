import { Bell } from "lucide-react";
const Notification = ({notifications}) => {
 return <>
  {notifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Bell className="mr-2 text-red-500" size={20} />
              Cảnh báo
            </h2>
            <div className="space-y-2">
              {notifications.slice(-3).map(notification => (
                <div key={notification.id} className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex justify-between items-center">
                    <p className="text-red-700">{notification.message}</p>
                    <span className="text-red-500 text-sm">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
 </>
}

export default Notification;
