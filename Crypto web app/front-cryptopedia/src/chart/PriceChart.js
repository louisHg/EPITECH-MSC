import React, { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const monthsName = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function timestampToLabel(timestamp, period) {
  const date = new Date(0);
  date.setUTCSeconds(timestamp);
  let label = date.getHours() + ":" + date.getMinutes();

  const monthNumber = (date.getMonth() + 1) % 12;
  console.log(monthNumber);
  if (period === "5y") {
    label = date.getFullYear();
  } else if (period.includes("d")) {
    label = monthsName[monthNumber] + " " + date.getDate();
  } else if (period === "3m" || period === "1y") {
    label = monthsName[monthNumber];
  } else if (period === "3y") {
    label = monthsName[monthNumber] + " " + date.getFullYear();
  }
  console.log(label);
  return label;
}

export default function PriceChart({ coinUUID, timePeriod }) {
  const apiKey = "coinrankinge09260f09ec21aed5a6268812c04ff5d262184418838fbb3";
  const url = useMemo(() => {
    return `https://api.coinranking.com/v2/coin/${coinUUID}/history?timePeriod=${timePeriod}&x-access-token=${apiKey}`;
  }, [coinUUID, timePeriod]);

  const [prices, setPrices] = useState([]);
  const [labels, setLabels] = useState([]);

  const setStates = (history) => {
    history.forEach((price) => {
      const newPrice = parseFloat(price.price).toFixed(4);
      const newLabel = timestampToLabel(price.timestamp, timePeriod);
      console.log(newLabel);
      setPrices((current) => [...current, newPrice]);
      setLabels((current) => [...current, newLabel]);
    });
  };

  const getHistory = () => {
    axios
      .get(url)
      .then((response) => {
        const history = response.data.data.history.reverse();
        setStates(history);
      })
      .catch((error) => console.log(error));
  };

  const initStates = () => {
    setPrices([]);
    setLabels([]);
  };

  useEffect(() => {
    getHistory();
    initStates();
    const interval = setInterval(() => {
      getHistory();
      initStates();
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [url]);

  const data = useMemo(() => {
    return {
      labels: labels,
      datasets: [
        {
          fill: true,
          label: "Dataset 2",
          data: prices,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };
  }, [prices, labels]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        display: false,
      },
      title: {
        display: false,
        text: "Chart.js Line Chart",
      },
    },
    elements: {
      point: {
        radius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#18181b",
      },
    },
  };

  return (
    <>
      <Line options={options} data={data} />
    </>
  );
}
