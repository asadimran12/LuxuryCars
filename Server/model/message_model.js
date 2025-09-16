const Mongoose = require("mongoose");
const messageSchema = new Mongoose.Schema(
  {
    senderId: {
      id: {
        type: Mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "sender.type", // dynamic reference
      },
      type: {
        type: String,
        required: true,
        enum: ["user", "Driver"], // can be User or Driver
      },
    },

    receiverId: {
      id: {
        type: Mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "receiver.type",
      },
      type: {
        type: String,
        required: true,
        enum: ["user", "Driver"],
      },
    },
    text: {
      type: String,
    },
    file: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = Mongoose.model("Message", messageSchema);
