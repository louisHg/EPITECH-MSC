// src/components/Map.tsx
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { cn } from "@/lib/utils";
import { TravelPoint } from "@prisma/client";

interface MyMapProps {
  position: [number, number];
  zoom: number;
  points: [number, number][];
  className?: string;
}

export default function MyMap({ ...props }: MyMapProps) {
  const { position, zoom, points, className } = props;

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      className={cn(
        "h-full w-full z-0 leaflet-container rounded-lg",
        className
      )}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points ? (
        <>
          <Polyline pathOptions={{ color: "blue" }} positions={points} />

          {points[0] && <Marker position={[points[0][0], points[0][1]]} />}
        </>
      ) : (
        <></>
      )}
    </MapContainer>
  );
}
