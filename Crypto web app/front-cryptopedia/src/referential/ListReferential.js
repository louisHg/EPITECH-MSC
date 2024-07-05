import React, { useState, useEffect } from "react";
import axios from "axios";
import Referential from "./Referential";

export default function ListReferential() {
  const apiKey = "coinrankinge09260f09ec21aed5a6268812c04ff5d262184418838fbb3";
  const [coins, setCoins] = useState([]);

  const getCoins = () => {
    axios
      .get(`https://api.coinranking.com/v2/coins?x-access-token=${apiKey}`)
      .then((res) => {
        console.log(res);
        setCoins(res.data.data.coins);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCoins();
    const interval = setInterval(getCoins, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Change
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Volume
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Market Capitalisation
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Variation
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Detail</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {coins.map((coin) => (
                    <Referential coin={coin} key={coin.uuid} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
