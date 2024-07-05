"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

const Dashboard: React.FC = () => {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );
  return (
    <div className="w-full flex-1 px-20 py-8 h-full">
      <Map position={[40.7128, -74.006]} zoom={12} />
    </div>
  );
};

export default Dashboard;
