import { useState, useEffect } from "react";
import { Parser } from "xml2js";
import axios from "axios";

function parsePubDate(pubDate) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date(pubDate);
  return (
    days[date.getDay()] +
    ", " +
    date.getDate() +
    " " +
    monthNames[date.getMonth()] +
    " " +
    date.getFullYear()
  );
}

function parseDescription(fullDescription) {
  return fullDescription.replace(/<[^>]+>/g, "");
}

export function useArticles(feed) {
  const addArticle = (item) => {
    let parsedDescription = parseDescription(item.description[0]),
      parsedDate = parsePubDate(item.pubDate[0]);
    const description = parsedDescription.trim();
    if (description.length !== 0) {
      let article = {
        src: item["media:content"][0]["$"]["url"],
        title: item.title,
        description: description,
        date: parsedDate,
        link: item.link,
      };
      setArticles((current) => [...current, article]);
    }
  };

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios
      .get(feed, {
        "Content-Type": "application/xml;charset=utf-8",
      })
      .then((response) => {
        const parser = new Parser();
        const data = response.data;
        parser.parseString(data, (err, result) => {
          const items = result.rss.channel[0].item;
          items.forEach((item) => addArticle(item));
        });
      })
      .catch((error) => console.error("data error", error));
  }, []);

  return articles;
}
