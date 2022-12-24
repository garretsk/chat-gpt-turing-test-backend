let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let Vote = new Schema (
  {
    promptNumber: {type: Number},
    whichOptionChatGPTGenerated: {type: Number}
  }
);

module.exports = mongoose.model("Vote", Vote);