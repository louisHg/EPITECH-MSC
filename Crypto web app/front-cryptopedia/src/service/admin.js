import axios from "axios";
var session = JSON.parse(sessionStorage.getItem('sessionObject'));
if (session == null) {
  token = "";
}
else{
  var token = session.SessionData.token
}

const prefix = "http://localhost/cryptopedia/sources";
function putAllowedArticles(sources,link) {
  axios
  .post("http://localhost:8081/cryptopedia/articles/deleteAll", {
      headers: {
        "Authorization" : `Bearer ${token}`
      },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => console.log(error));

  for (let index = 0; index < sources.length; index++) {
    console.log(index);
  axios
  .post("http://localhost:8081/cryptopedia/articles", 
    [
        
      {
        "id": index ,
        "name": sources[index],
        "url" : link[index]
      }
    ]
    , {
      headers: {
        "Authorization" : `Bearer ${token}`
      },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => console.log(error));
  }
}

function getAllowedArticles() {
  const url = prefix;
  return axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export { putAllowedArticles, getAllowedArticles };
