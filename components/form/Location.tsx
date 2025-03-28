import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

//@ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/icon/marker.png",
  iconUrl: "/icon/marker.png",
  shadowUrl: "/icon/marker.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export interface LocationData {
  latitude: number;
  longitude: number;
}

const LocationInputForm = ({
  className,
  locationData,
  setLocationData,
}: {
  className?: string;
  locationData: LocationData;
  setLocationData: React.Dispatch<React.SetStateAction<LocationData>>;
}) => {
  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLocationData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return locationData.latitude ? (
      <Marker position={[locationData.latitude, locationData.longitude]}>
        <Popup>Selected Location</Popup>
      </Marker>
    ) : null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Location submitted:", locationData);
  };

  return (
    <MapContainer
      center={[locationData.latitude, locationData.longitude]}
      zoom={13}
      scrollWheelZoom={false}
      className={className}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default LocationInputForm;
