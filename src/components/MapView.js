import { MapPin, Maximize2, Minimize2 } from "lucide-react";
import { useState, useEffect } from "react";
import { clusterServices } from "../utils/services/clusterService";

const MapView = () => {
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [clusters, setClusters] = useState([]);
  const [markers, setMarkers] = useState([]); // Lưu trữ markers để quản lý

  const getClusters = async () => {
    try {
      const response = await clusterServices.get();
      setClusters(response.data.data);
    } catch (error) {
      console.error("Error fetching clusters:", error);
    }
  };

  // Parse địa chỉ từ string "lat, lng" thành object
  const parseAddress = (address) => {
    if (!address) return null;
    const [lat, lng] = address.split(',').map(coord => parseFloat(coord.trim()));
    if (isNaN(lat) || isNaN(lng)) return null;
    return { lat, lng };
  };

  // Tải Google Maps API
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCV3lcopG6eLhguC1CUiFYky9I82qg80Hw&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    window.initMap = () => {
      setIsLoaded(true);
    };
    
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Khởi tạo bản đồ
  useEffect(() => {
    if (!isLoaded || map) return;

    const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 21.0285, lng: 105.8542 }, // Trung tâm Hà Nội
      zoom: 10,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    setMap(mapInstance);
    getClusters(); // Lấy dữ liệu clusters
  }, [isLoaded]);

  // Tạo SVG icon cho marker
  const createSVGIcon = () => {
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16.247 7.761a6 6 0 0 1 0 8.478"/>
        <path d="M19.075 4.933a10 10 0 0 1 0 14.134"/>
        <path d="M4.925 19.067a10 10 0 0 1 0-14.134"/>
        <path d="M7.753 16.239a6 6 0 0 1 0-8.478"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
    `;
    
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgString);
  };

  // Xóa tất cả markers cũ
  const clearMarkers = () => {
    markers.forEach(marker => {
      marker.setMap(null);
    });
    setMarkers([]);
  };

  // Thêm markers từ dữ liệu clusters
  useEffect(() => {
    if (!map || !clusters.length) return;
    clearMarkers();

    const newMarkers = [];
    const bounds = new window.google.maps.LatLngBounds();

    clusters.forEach(cluster => {
      const position = parseAddress(cluster.address);
      
      if (!position) {
        console.warn(`Invalid address for cluster ${cluster.code}:`, cluster.address);
        return;
      }

      const marker = new window.google.maps.Marker({
        position: position,
        map: map,
        title: `${cluster.code} - ${cluster.name}`,
        icon: {
          url: createSVGIcon(),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(16, 16)
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; text-align: center; min-width: 200px;">
            <h4 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px; color: #1f2937;">Cụm ${cluster.code}-${cluster.name}</h4>
            <p style="margin: 0; color: #666; font-size: 11px;">Vị trí cụm cảm biến IoT</p>
          </div>
        `,
        disableAutoPan: false
      });

      // Event listeners cho marker
      marker.addListener('mouseover', () => {
        infoWindow.open(map, marker);
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      marker.addListener('mouseout', () => {
        infoWindow.close();
      });
      newMarkers.push(marker);
      bounds.extend(position);
    });

    map.addListener('click', () => {
      newMarkers.forEach(marker => {
        const infoWindows = marker.get('infoWindows') || [];
        infoWindows.forEach(iw => iw.close());
      });
    });

    setMarkers(newMarkers);
    if (newMarkers.length > 1) {
      map.fitBounds(bounds);
      const listener = window.google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() > 15) map.setZoom(15);
        window.google.maps.event.removeListener(listener);
      });
    } else if (newMarkers.length === 1) {
      const position = parseAddress(clusters[0].address);
      if (position) {
        map.setCenter(position);
        map.setZoom(13);
      }
    }
  }, [map, clusters]);

  useEffect(() => {
    if (map) {
      setTimeout(() => {
        window.google.maps.event.trigger(map, 'resize');
      }, 100);
    }
  }, [isFullscreen, map]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isLoaded) {
    return (
      <div className="h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Đang tải bản đồ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      ${isFullscreen 
        ? 'fixed inset-0 z-50 bg-white' 
        : 'bg-white h-full w-full'
      }
    `}>
      {/* Header - chỉ hiện khi fullscreen */}
      {isFullscreen && (
        <div className="absolute top-4 left-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg flex items-center justify-between">
          <div className="flex items-center">
            <MapPin size={20} className="mr-2 text-blue-600" />
            <h3 className="font-semibold text-gray-800">
              Bản đồ cảm biến IoT ({clusters.length} cụm)
            </h3>
          </div>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="Thu nhỏ"
          >
            <Minimize2 size={18} className="text-gray-600" />
          </button>
        </div>
      )}

      {/* Map Container */}
      <div 
        id="map" 
        className={`
          ${isFullscreen 
            ? 'h-screen w-full rounded-none' 
            : 'h-full w-full rounded-none'
          }
        `}
        style={{
          paddingTop: isFullscreen ? '80px' : '0'
        }}
      />

      {/* Fullscreen Button - chỉ hiện khi không fullscreen */}
      {!isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white transition-colors duration-200"
          title="Toàn màn hình"
        >
          <Maximize2 size={18} className="text-gray-600" />
        </button>
      )}

      {/* Loading overlay khi đang fetch data */}
      {isLoaded && clusters.length === 0 && (
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-5">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;