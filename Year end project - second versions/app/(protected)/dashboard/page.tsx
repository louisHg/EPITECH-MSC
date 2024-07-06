"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { Hiking } from "@prisma/client";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { set } from "zod";

// Componente: HeroLocation
const DynamicMap = dynamic(() => import("./components/dashboard-map"), {
  ssr: false,
});

interface DashboardPageProps {
  searchParams: {
    lat: number;
    lng: number;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = ({ searchParams }) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Trigger the searchParams changement
    setKey((prevKey) => prevKey + 1);
  }, [searchParams]);

  return (
    <div className="w-full h-full relative overflow-x-hidden  flex flex-row">
      <DynamicMap
        key={key}
        geoData={{ lat: searchParams.lat, lng: searchParams.lng }}
      />
    </div>
  );
};

export default DashboardPage;
