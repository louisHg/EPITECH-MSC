import { useEffect, useState } from "react";
import { getAllowedArticles } from "../service/admin";

export function useGetAllowedSources() {
  const [sources, setSources] = useState([]);

  useEffect(() => {
    const request = getAllowedArticles();
    request
      .then((response) => {
        console.log(response.data);
        setSources(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return sources;
}
