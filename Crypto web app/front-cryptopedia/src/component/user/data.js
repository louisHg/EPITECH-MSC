import axios from "axios";
var session = JSON.parse(sessionStorage.getItem('sessionObject'));
if (session == null) {
  token = "";
}
else{
  var token = session.SessionData.token
}
console.log(token);
async function  getArticle() {
  axios
  .get("http://localhost:8081/cryptopedia/articles", {
      headers: {
        "Authorization" : `Bearer ${token}`
      },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => console.log(error));

 }
  
export { getArticle };
