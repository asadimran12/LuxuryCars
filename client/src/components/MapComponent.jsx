import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { API_URL } from "../utils/apiConfig";

// Connect to backend Socket.IO server
const socket = io(API_URL, {
  withCredentials: true,
});

// Fix Leaflet default marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Helper to re-center map
const RecenterMap = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.setView(location);
    }
  }, [location, map]);
  return null;
};

const MapComponent = ({ pickupCoords, dropoffCoords }) => {
  const [location, setLocation] = useState({ lat: 31.5204, lng: 74.3587 });
  const [route, setRoute] = useState([{ lat: 31.5204, lng: 74.3587 }]);

  useEffect(() => {
    let watchId;

    // ✅ Case 1: Live driver tracking (when no pickup/dropoff)
    if (!pickupCoords && !dropoffCoords && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setLocation(coords);
          setRoute((prev) => [...prev, coords]);
          socket.emit("sendLocation", coords);
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );

      socket.on("receiveLocation", (data) => {
        setLocation(data);
        setRoute((prev) => [...prev, data]);
      });
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      socket.off("receiveLocation");
    };
  }, [pickupCoords, dropoffCoords]);

  // ✅ Case 2: Booking Map (pickup + dropoff)
  if (pickupCoords && dropoffCoords) {
    return (
      <MapContainer
        center={pickupCoords}
        zoom={13}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={pickupCoords}>
          <Popup>📍 Pickup Location</Popup>
        </Marker>

        <Marker position={dropoffCoords}>
          <Popup>🎯 Dropoff Location</Popup>
        </Marker>

        {/* Line between pickup and dropoff */}
        <Polyline positions={[pickupCoords, dropoffCoords]} color="green" />
      </MapContainer>
    );
  }

  // ✅ Default: Live Driver Tracking Mode
  return (
    <MapContainer
      center={location}
      zoom={15}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Driver marker */}
      <Marker position={location}>
        <Popup>
          🚗 Driver is here <br />
          Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
        </Popup>
      </Marker>

      {/* Route polyline */}
      <Polyline positions={route} color="blue" />

      <RecenterMap location={location} />
    </MapContainer>
  );
};

export default MapComponent;
