const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chat_name: { type: String, trim: true },
    password: {type:Object},
    public: {type:Boolean},
    creator_id:{type:String},
    messages:{type:[Object]},
    users:{type:[Object]}
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
