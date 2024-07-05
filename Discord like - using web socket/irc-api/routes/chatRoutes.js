const express = require("express");
const {
  createGroupChat,
  fetchOne,
  fetchAll,
  addMessage,
  deleteGroupChat,
  /*removeFromGroup,
  addToGroup,
  renameGroup,*/
} = require("../controllers/chatControllers");
const { getAllUsers } = require("../helper_functions")

const router = express.Router();

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

router.get("/get_chat", fetchOne);
router.get("/get_all_chats", fetchAll);

router.post("/create_chat", createGroupChat);
router.post("/delete_chat",deleteGroupChat);

router.post("/addMessage", addMessage);

router.get("/get_users",function(req,res){
  console.log(req.query.id)
  res.json(getAllUsers(req.query.id))
})

/*router.route("/rename").put( renameGroup);
router.route("/groupremove").put( removeFromGroup);
router.route("/groupadd").put( addToGroup);*/

module.exports = router;
