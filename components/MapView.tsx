"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { resources } from "@/data/resources";
import { CATEGORY_LABELS } from "@/lib/types";

// Leaflet's default marker icons resolve to broken paths under a bundler,
// so point them at the CDN copies explicitly.
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapView() {
  return (
    <MapContainer
      center={[34.19, -84.14]}
      zoom={11}
      scrollWheelZoom={false}
      className="h-[70vh] min-h-96 w-full rounded-xl border border-earth-border"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {resources.map((r) => (
        <Marker key={r.id} position={[r.geo.lat, r.geo.lng]} icon={icon}>
          <Popup>
            <strong>{r.name}</strong>
            <br />
            {CATEGORY_LABELS[r.category]}
            <br />
            {r.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
