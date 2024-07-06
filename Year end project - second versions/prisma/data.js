const { Prisma } = require("@prisma/client");

const difficulties = [
  {
    label: "Easy",
  },
  {
    label: "Medium",
  },
  {
    label: "Hard",
  },
];

const hikings = [
  {
    name: "Nom de la randonnée",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pretium mollis velit eu ultrices. Praesent semper vel dolor sit amet suscipit. Integer rhoncus varius nunc, at congue magna dapibus quis. Pellentesque ut ipsum nec dolor maximus elementum. Aenean orci quam, fermentum a tincidunt ut, varius vitae ante. Sed varius quam a purus varius semper. Quisque consectetur volutpat arcu, in convallis dolor mollis vel. Pellentesque ut ipsum nec dolor maximus elementum. Aenean orci quam, fermentum a tincidunt ut, varius vitae ante. Sed varius quam a purus varius semper. Quisque consectetur volutpat arcu, in convallis dolor mollis vel.",
    city: "Ville",
    area: "Région",
    country: "France",
    duration: "01:00",
    latitude: 48.87397380289263,
    longitude: 2.3428344726562504,
    difficultyId: 1,
    distance: 7.5,
  },
  {
    name: "Nom de la randonnée",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pretium mollis velit eu ultrices. Praesent semper vel dolor sit amet suscipit. Integer rhoncus varius nunc, at congue magna dapibus quis. Pellentesque ut ipsum nec dolor maximus elementum. Aenean orci quam, fermentum a tincidunt ut, varius vitae ante. Sed varius quam a purus varius semper. Quisque consectetur volutpat arcu, in convallis dolor mollis vel. Pellentesque ut ipsum nec dolor maximus elementum. Aenean orci quam, fermentum a tincidunt ut, varius vitae ante. Sed varius quam a purus varius semper. Quisque consectetur volutpat arcu, in convallis dolor mollis vel.",
    city: "Ville",
    area: "Région",
    country: "France",
    duration: "01:00",
    latitude: 48.86752370683404,
    longitude: 0.348134517669678,
    difficultyId: 1,
    distance: 7.5,
  },
  {
    name: "Nom de la randonnée",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pretium mollis velit eu ultrices. Praesent semper vel dolor sit amet suscipit. Integer rhoncus varius nunc, at congue magna dapibus quis. Pellentesque ut ipsum nec dolor maximus elementum. Aenean orci quam, fermentum a tincidunt ut, varius vitae ante. Sed varius quam a purus varius semper. Quisque consectetur volutpat arcu, in convallis dolor mollis vel. Pellentesque ut ipsum nec dolor maximus elementum. Aenean orci quam, fermentum a tincidunt ut, varius vitae ante. Sed varius quam a purus varius semper. Quisque consectetur volutpat arcu, in convallis dolor mollis vel.",
    city: "Ville",
    area: "Région",
    country: "France",
    duration: "01:00",
    latitude: 48.87003609694023,
    longitude: 2.348713874816895,
    difficultyId: 1,
    distance: 7.5,
  },
];

module.exports = {
  difficulties,
  hikings,
};
