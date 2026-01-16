"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Use setTimeout to defer the state update to the next tick
    // This prevents synchronous state updates during render
    const timer = setTimeout(() => setIsClient(true), 0);

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return isClient;
}

export default function MyMap() {
  const isClient = useIsClient();
  const position: [number, number] = [34.68452, 33.0072866]; // Limassol coords

  if (!isClient) {
    return (
      <div className="h-full w-full animate-pulse rounded-xl bg-gray-200"></div>
    );
  }

  const customIcon = new L.Icon({
    iconUrl: "/Location-Black.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40], // bottom center
  });

  return (
    <MapContainer
      center={position}
      zoom={14}
      scrollWheelZoom={true}
      className="z-10 h-full w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position} icon={customIcon}>
        <Popup>Porsche Center Limassol</Popup>
      </Marker>
    </MapContainer>
  );
}
