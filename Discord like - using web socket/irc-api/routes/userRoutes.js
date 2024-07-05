const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  getFavorites,
  removeFavorites,
  addFavorites,
  fetchFav,
} = require("../controllers/userConstrollers");

const router = express.Router();

router.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin','*')
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers","Content-Type, Authorization")
  next()
})

router.get("/",()=>console.log("Oui?"))
router.get("/users",allUsers)
router.get("/login", authUser);
router.post("/register",registerUser);

router.get("/getFavorites", getFavorites);
router.post("/addFavorites", addFavorites);
router.post("/removeFavorites", removeFavorites);
router.get("/get_all_favorite_chats", fetchFav);

module.exports = router;
