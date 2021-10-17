const Joi = require("joi");
const Attendance = require("../models/attendance.model");
const Customer = require("../models/customer.model");

const ObjectSchema = Joi.object({
  customer_code: Joi.number().required(),
  isPresent: Joi.boolean().required(),
});

const AttendanceSchema = Joi.object({
  attendances: Joi.array().required(),
});

const validateAttendance = (attendance) =>
  AttendanceSchema.validate(attendance);

const validateObject = (object) => ObjectSchema.validate(object);

const markAttendance = async (req, res) => {
  const { error: attendanceError } = validateAttendance(req.body);
  if (attendanceError)
    return res.status(400).json({ message: attendanceError.message });
  for (let customer of req.body.attendances) {
    const { error: objectError } = validateObject(customer);
    if (objectError)
      return res.status(400).json({ message: objectError.message });
  }
  try {
    for (let customer of req.body.attendances) {
      const user = await Customer.findOne({
        customer_code: customer.customer_code,
      });
      if (!user)
        return res.status(404).json({
          message: `User with the Customer Code ${customer.customer_code} doesn't Exist`,
        });
      await Attendance.create(customer);
    }
    return res.status(200).json({ message: "Attendance Marked Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An Unexpected Error Occurred", error });
  }
};

const getReport = async (req, res) => {
  let myCurrentDate = new Date();
  let myPastDate = new Date(myCurrentDate);
  myPastDate.setDate(myPastDate.getDate() - 10);
  const customers = await Customer.aggregate([
    {
      $lookup: {
        from: "attendances",
        let: { customer_code: "$customer_code", createdAt: "$createdAt" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$customer_code", "$$customer_code"] },
                  { $gt: ["$$createdAt", myPastDate] },
                ],
              },
            },
          },
          { $project: { _id: 0, customer_code: 0 } },
        ],
        as: "attendances",
      },
    },
    { $unset: ["password"] },
  ]);
  return res.status(200).json({ message: "Success", customers });
};

module.exports = {
  markAttendance: markAttendance,
  getReport: getReport,
};
