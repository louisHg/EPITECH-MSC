const asyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const fetchOne = asyncHandler(async (req, res) => {
  try {
    const FullChat = await Chat.findOne({ _id: req.query.id });

    res.status(200).json(FullChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchAll = asyncHandler(async (req, res) => {
  const channels = await Chat.find({});
  var filteredChannels = [];
  for (let i = 0; i < channels.length; i++) {
    filteredChannels.push({
      _id: channels[i]._id,
      chat_name: channels[i].chat_name,
    });
  }
  res.send(filteredChannels);
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
  var new_server_data = {
    chat_name: req.body.chat_name,
    creator_id: req.body.creator_id,
    public: req.body.public,
    password: req.body.password,
    messages: [],
    users: [],
  };
  try {
    const groupChat = await Chat.create(new_server_data);
    res.status(200).json(groupChat._id);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const deleteGroupChat = asyncHandler(async (req, res) => {

  const { user_id, chat_name } = req.body;

  const selectedChat = await Chat.findOne({chat_name : chat_name})
  console.log(selectedChat)

  if(selectedChat){
    if(selectedChat.creator_id === user_id){
      await Chat.findOneAndDelete({_id : selectedChat._id})
      res.json("Removed")
    }
    else{
      res.json("Pas les droits")
    }
  }
  else{
    res.json("Not found")
  }
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const add_message = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!add_message) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(add_message);
  }
});

async function addMessage(channel_id,message_data) {
  try {
    await Chat.findOneAndUpdate(
      {
        _id:channel_id
      },
      {
        $push: {
          messages: message_data,
        },
      }
    );
  } catch (err) {
    send("Error " + err);
  }
}

module.exports = {
  fetchOne,
  fetchAll,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
  addMessage,
  deleteGroupChat
};
