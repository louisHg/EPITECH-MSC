"use client";

import { Hiking } from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { TravelPoint } from "@prisma/client";
import PreviewMap from "@/app/(protected)/create-hiking/components/preview-map";

const parseTravelPoints = (travelPoints: TravelPoint[]): [number, number][] => {
  const points: [number, number][] = Array.from(travelPoints).map((point) => {
    const lat = point.latitude;
    const lon = point.longitude;
    return [lat, lon];
  });

  return points;
};

interface TravelDescription {
  hiking: Hiking;
  pointsList: TravelPoint[];
}

const TravelDescription: React.FC<TravelDescription> = ({
  hiking,
  pointsList,
}) => {
  const [points, setPoints] = useState<[number, number][]>(
    parseTravelPoints(pointsList)
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    parseTravelPoints(pointsList)[0]
  );

  return (
    <div className="flex flex-col md:flex-row w-full md:px-20 gap-4">
      <div className="flex flex-col gap-5 w-full md:w-3/5 h-full">
        <h2 className="text-2xl font-semibold">Description</h2>
        <p>{hiking.description}</p>
      </div>
      <div className="md:w-2/5 w-full md:h-[300px] h-[150px] rounded-3xl overflow-hidden">
        <PreviewMap points={points} mapCenter={mapCenter} />
      </div>
    </div>
  );
};

export default TravelDescription;
