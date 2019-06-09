var mongoose = require("mongoose");

var ecotourismSchema = new mongoose.Schema({
    title: String,
    price: String,
    image: String,
    description: String,
    phone_no: String,
    Email: String,
    author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   	},
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Ecotourism", ecotourismSchema);
