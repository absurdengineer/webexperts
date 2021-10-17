const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema(
  {
    //... Fields ...
    customer_code: { type: Number, ref: "customers" },
    date: { type: Date, nullable: false },
    isPresent: { type: Boolean, default: false, nullable: false },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("attendances", AttendanceSchema);
