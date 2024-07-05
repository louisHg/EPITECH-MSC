import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ChartPeriod from "./ChartPeriod";
import PriceChart from "./PriceChart";

const periods = ["1h", "3h", "12h", "24h", "7d", "30d", "3m", "1y", "3y", "5y"];
export default function CryptoChart({ coinUUID }) {
  console.log(coinUUID);
  const location = useLocation();
  console.log(location.state.data);
  var index = 0 ;
  var y = 0;
  var coin = []; 
  var coinsId = "";
  //pour stocker la valeur 
  var [coinsId , setData] = useState("");
  // location.state.data.forEach(elem => {
  //   console.log(elem.checked);
  //   if (elem.checked == true) {
  //     coin[y] = elem.name ;
  //     console.log(coin);
  //     if (coinsId == "") {
  //       coinsId = elem.name;
  //       console.log(coinsId);
  //     }
  //     index ++;
  //     y++
  //   }
  // });

  const [period, setPeriod] = useState("24h");
  return (
    
    <div className="flex justify-center items-center flex-col">
       <select onChange={e => setData(e.target.value)} >
       {coin.map(item => (
        <option  key={item}>{item}</option>
      ))}
       </select>
      <PriceChart coinUUID={location.state.data} timePeriod={period} />
      <ChartPeriod
        periods={periods}
        setPeriod={setPeriod}
        selectedPeriod={period}
      />
    </div>
  );
}
