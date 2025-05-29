"use client"
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { connectSocket, disconnectSocket } from "../../utils/socket";
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

interface Location {
  lat: number;
  lng: number;
}

const TrackPage = () => {
  const orderId = "order123";
  const customerLocation: Location = { lat: 23.7965, lng: 86.4356 };

  const [deliveryLocation, setDeliveryLocation] = useState<Location | null>(null);
  const [deliveryIcon, setDeliveryIcon] = useState<any>(null);
  const [destinationIcon, setDestinationIcon] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [leaflet, setLeaflet] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    setIsClient(true);

    const setup = async () => {
      if (typeof window === "undefined") return;

      const L = await import("leaflet");
      setLeaflet(L);

      setDeliveryIcon(
        new L.Icon({
          iconUrl: "/delivery-bike.png",
          iconSize: [40, 40],
        })
      );
      setDestinationIcon(
        new L.Icon({
          iconUrl: "/placeholder.png",
          iconSize: [40, 40],
        })
      );

      const token = localStorage.getItem("token");
      if (token) {
        const socket = connectSocket(token);
        console.log("Emitting join-order with orderId:", orderId);
        socket.emit("join-order", orderId);

        socket.on("location-update", (location: Location) => {
          setDeliveryLocation(location);
        });

        return () => {
          disconnectSocket();
        };
      }
    };

    setup();
  }, [orderId]);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {isClient && leaflet && (
        <MapContainer center={customerLocation} zoom={13} style={{ height: "100vh", width: "100vw" }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">carto</a>'
            subdomains="abcd"
            maxZoom={20}
          />
          {destinationIcon && (
            <Marker position={customerLocation} icon={destinationIcon}>
              <Popup>Customer Location</Popup>
            </Marker>
          )}
          {deliveryLocation && deliveryIcon && (
            <Marker position={deliveryLocation} icon={deliveryIcon}>
              <Popup>Delivery Partner</Popup>
            </Marker>
          )}
        </MapContainer>
      )}
      {!isClient && <p>Loading map...</p>}
    </div>
  );
};

export default TrackPage;