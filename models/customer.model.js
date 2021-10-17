const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    //... Fields ...
    customer_code: { type: Number, nullable: false },
    name: { type: String, nullable: false },
    designation: { type: String, nullable: false },
    salary: { type: Number, nullable: false },
    password: { type: String, nullable: false },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

autoIncrement.initialize(mongoose.connection);

CustomerSchema.plugin(autoIncrement.plugin, {
  model: "customers", // collection or table name in which you want to apply auto increment
  field: "customer_code", // field of model which you want to auto increment
  startAt: 1101, // start your auto increment value from 1
  incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model("customers", CustomerSchema);
