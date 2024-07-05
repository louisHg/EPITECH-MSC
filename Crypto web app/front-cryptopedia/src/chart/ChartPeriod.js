import React, { useState } from "react";

export default function ChartPeriod({ periods, setPeriod, selectedPeriod }) {
  const periodSelection = (period) => {
    setPeriod(period);
  };

  return (
    <div className="rounded border border-[#cee1ff] h-[3rem] w-[31rem] flex justify-center items-center">
      <div className="text-[#3363aa] flex justify-center items-center p-1.5 mr-2.5 border-r-blue-400">
        Time period
      </div>
      <div className="flex justify-center items-center ">
        {periods.map((period, index) => {
          return (
            <button
              onClick={() => {
                periodSelection(period);
              }}
              key={index}
              className={
                selectedPeriod === period
                  ? "text-white p-1.5 m-px bg-[#3363aa] rounded font-semibold"
                  : "font-semibold text-[#002358] p-1.5 m-px"
              }
            >
              {period}
            </button>
          );
        })}
      </div>
    </div>
  );
}
