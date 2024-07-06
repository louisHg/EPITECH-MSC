import { useState, useEffect } from "react";

function useDeviceType() {
  const [deviceType, setDeviceType] = useState(
    () => getDeviceType() || "desktop"
  );

  function getDeviceType() {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) {
        return "desktop";
      } else if (window.innerWidth >= 768) {
        return "tablet";
      } else {
        return "mobile";
      }
    }
    return "desktop"; // Valeur par défaut côté serveur
  }

  useEffect(() => {
    function handleResize() {
      setDeviceType(getDeviceType());
    }

    // Ajouter l'écouteur d'événement resize
    window.addEventListener("resize", handleResize);

    // Nettoyer l'écouteur d'événement lors du démontage du composant
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return deviceType;
}

export default useDeviceType;
