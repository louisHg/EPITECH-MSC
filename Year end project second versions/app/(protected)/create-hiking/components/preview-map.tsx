import { TravelPoint } from "@prisma/client";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import { MapContainer } from "react-leaflet";

interface PreviewMapProps {
  points: [number, number][];
  mapCenter: [number, number];
}

const PreviewMap: React.FC<PreviewMapProps> = ({ points, mapCenter }) => {
  const [key, setKey] = useState(0);

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [mapCenter]);
  return (
    <Map
      key={key}
      position={mapCenter}
      zoom={13}
      points={points}
      className="h-[400px]"
    />
  );
};

export default PreviewMap;
