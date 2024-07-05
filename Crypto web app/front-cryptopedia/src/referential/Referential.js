import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import CryptoSparkline from "./CryptoSparkline";
import { Link, useNavigate } from "react-router-dom";

export default function Referential({ coin }) {
  const navigate = useNavigate();

  const rawToMillion = (value) => {
    const divided = value / Math.pow(10, 9);
    return divided.toFixed(4);
  };

  return (
    <>
      <tr>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 text-left">
          <div className="flex items-center">
            <div className="h-10 w-10 flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src={coin.iconUrl}
                alt={"" + coin.symbol}
              />
            </div>
            <div className="ml-4">
              <div className="font-medium text-gray-900">{coin.symbol}</div>
              <div className="text-gray-500">{coin.name}</div>
            </div>
          </div>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-left">
          <div className="text-gray-900">${coin.price}</div>{" "}
        </td>
        <td
          className={`whitespace-nowrap px-4 py-4 text-sm ${
            coin.change > 0 ? "text-green-500" : "text-red-600"
          } text-left`}
        >
          {coin.change}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-left">
          {rawToMillion(coin["24hVolume"])}M
        </td>
        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900 text-left">
          ${rawToMillion(coin.marketCap)}M
        </td>
        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900 text-left">
          <CryptoSparkline sparkline={coin.sparkline} variation={coin.change} />
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
          <Link className="text-indigo-600 hover:text-indigo-900" to="/chart" state={{data : coin.uuid}}>
          Detail
          </Link>
        </td>
      </tr>
    </>
  );
}
