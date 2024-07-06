function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInKm(
  coord1: [number, number],
  coord2: [number, number]
) {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;

  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

function getTotalDistance(coordinates: [number, number][]) {
  let totalDistance = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const coord1 = coordinates[i - 1];
    const coord2 = coordinates[i];
    totalDistance += getDistanceFromLatLonInKm(coord1, coord2);
  }
  return totalDistance;
}

export default getTotalDistance;
