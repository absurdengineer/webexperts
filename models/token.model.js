const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  //... Fields ...
  customer_code: { type: Number, ref: "customers" },
  token: { type: String, nullable: false },
});

module.exports = mongoose.model("tokens", TokenSchema);
