import React, { useState } from 'react';
import { BarChart3, ChevronDown, Check } from "lucide-react";

const Header = ({ isConnected, notifications, selectedCluster, setSelectedCluster, clusters }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleClusterSelect = (cluster) => {
    setSelectedCluster(cluster);
    setIsDropdownOpen(false);
  };

  const getClusterLabel = (cluster) => {
    return cluster === 'all' ? 'Tất cả cụm' : `Cụm ${cluster}`;
  };

  return (
    <div className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">IoT Dashboard</h1>
            </div>
          </div>

          {/* Custom Cluster Dropdown */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between px-4 py-2 min-w-[140px] bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <span className="text-gray-700 font-medium">
                  {getClusterLabel(selectedCluster)}
                </span>
                <ChevronDown 
                  className={`ml-2 h-4 w-4 text-gray-500 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                  <div
                    onClick={() => handleClusterSelect('all')}
                    className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                      selectedCluster === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <span>Tất cả cụm</span>
                    {selectedCluster === 'all' && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  
                  {clusters.map(cluster => (
                    <div
                      key={cluster}
                      onClick={() => handleClusterSelect(cluster)}
                      className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                        selectedCluster === cluster ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <span>Cụm {cluster}</span>
                      {selectedCluster === cluster && (
                        <Check className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Overlay để đóng dropdown khi click bên ngoài */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default Header;