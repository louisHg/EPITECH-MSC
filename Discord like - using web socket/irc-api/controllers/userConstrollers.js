const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { username, accountName, password } = req.body;

  if (!username || !accountName || !password) {
    res.status(400);
    throw new Error("Please Enter all the fields");
  }

  const userExists = await User.findOne({ accountName });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    username,
    accountName,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      accountName: user.accountName,
      token: generateToken(user._id),
      status: "successful",
    });
  } else {
    res.status(400);
    throw new Error("Failed to Create the User");
  }
});

// if true login
const authUser = asyncHandler(async (req, res) => {
  const { accountName, password } = req.query;

  const user = await User.findOne({ accountName });
  console.log(user)

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      accountName: user.accountName,
      token: generateToken(user._id),
      saved_channels : user.saved_channels,
      status: "successful",
    });
  } else {
    res.status(401);
    throw new Error("Invalid accountName or Password");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          { accountName: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword);
  res.send(users);
});


const getFavorites = asyncHandler(async (req, res) => {
  try {
    const users = await User.findOne(req.body._id);
    console.log(users.saved_channels)
    res.send(users.saved_channels);
  } catch (err) {
    res.send("Error " + err);
  }
});

const fetchFav = asyncHandler(async (req, res) => {
  const channels_fav = await User.findOne({_id : req.query.id});
  res.send(channels_fav.saved_channels);
});

const addFavorites = asyncHandler(async (req, res) => {
  console.log("oui")
  console.log(req.body)
  try {
    const name = req.body.username;
    const channel = req.body.saved_channels;
    const channel_name = req.body.saved_channels_name;
    await User.findOneAndUpdate(
      {
        _id : req.body.id,
      },
      {
        $addToSet: {
          saved_channels: {"channel_id" : channel, "channel_name" : channel_name}
        },
      }
    );
    res.send(channel + " is created");
  } catch (err) {
    res.send("Error " + err);
  }
});

const removeFavorites = asyncHandler(async (req, res) => {
  try {
    const name = req.body.username;
    const channel = req.body.saved_channels;
    const channel_name = req.body.saved_channels_name;
    await User.findOneAndUpdate(
      {
        _id : req.body.id,
      },
      {
        $pull: {
          saved_channels: {"channel_id" : channel, "channel_name" : channel_name}
        },
      }
    );
    res.send(channel + " is removed");
  } catch (err) {
    res.send("Error " + err);
  }
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
  getFavorites,
  addFavorites,
  removeFavorites,
  fetchFav,
};
