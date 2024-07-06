import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Hiking, Prisma } from "@prisma/client";
import runIcon from "@/assets/running_icon.svg";
import L from "leaflet";

const iconRun = L.Icon.extend({
  options: {
    iconUrl: runIcon,
    iconRetinaUrl: runIcon,
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(60, 75),
    className: "leaflet-div-icon",
  },
});

type HikingWithTravelPoints = Prisma.HikingGetPayload<{
  include: { travelPoint: true };
}>;

interface MapComponentProps {
  geoData: {
    lat: number;
    lng: number;
  };
}

const MapComponent: React.FC<MapComponentProps> = ({ geoData }) => {

  return (
    <MapContainer
      center={[geoData.lat, geoData.lng]}
      zoom={12}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default MapComponent;
