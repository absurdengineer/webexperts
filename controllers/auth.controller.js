const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Token = require("../models/token.model");
const salary = require("../data/salary.data.json");
const Customer = require("../models/customer.model");

//? Authentication Schema
const AuthenticationSchema = Joi.object({
  customer_code: Joi.number().label("Customer Code").when("register", {
    is: 1,
    then: Joi.forbidden(),
    otherwise: Joi.required(),
  }),
  name: Joi.string().when("register", {
    is: 1,
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  designation: Joi.string()
    .valid("manager", "employee", "office assistant")
    .when("register", {
      is: 1,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
  password: Joi.string()
    .label("Password")
    .pattern(
      new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
      )
    )
    .error(
      new Error(
        "Password must be minimum 8 characters long and Contain at least 1 uppercase, 1 lowercase and 1 special character."
      )
    )
    .required(),
  register: Joi.number().optional(),
});

//? Authentication Validator
const validateAuthentication = (user) => AuthenticationSchema.validate(user);

//? Register API Handler
const register = async (req, res) => {
  const { error: authenticationError } = validateAuthentication({
    ...req.body,
    register: 1,
  });
  if (authenticationError)
    return res.status(400).json({ message: authenticationError.message });
  const hashedPassword = await bcrypt.hash(req.body.password, 11);
  req.body.password = hashedPassword;
  req.body.salary = salary[req.body.designation];
  try {
    const customer = await Customer.create(req.body);
    return res.status(200).json({
      message: "User Register Successfully.",
      data: {
        customer_code: customer.customer_code,
        name: customer.name,
        designation: customer.designation,
        salary: customer.salary,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Unable to Register User.", error: error });
  }
};

//? Login API Handler
const login = async (req, res) => {
  try {
    const { error } = validateAuthentication(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const { customer_code, password } = req.body;
    const customer = await Customer.findOne({ customer_code });
    if (!customer)
      return res
        .status(400)
        .json({ message: "Authentication Error : Invalid Email or Password" });
    const isValid = await bcrypt.compare(password, customer.password);
    if (!isValid)
      return res
        .status(400)
        .json({ message: "Authentication Error : Invalid Email or Password" });
    let token = jwt.sign(
      { customer_code: customer.customer_code, name: customer.name },
      process.env.JSONPRIVATEKEY,
      { expiresIn: "30d" }
    );
    const dbtoken = await Token.findOne({
      customer_code: customer.customer_code,
    });
    if (dbtoken) {
      dbtoken.token = token;
      dbtoken.save();
    } else await Token.create({ customer_code: customer.customer_code, token });
    return res.status(200).json({
      message: "Authentication Successful : User Logged In.",
      token,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error });
  }
};

//? Fetch Profile Handler
const getProfile = (req, res) => {
  try {
    return res.status(200).json({
      message: "User Profile Fetched Siuccessfully.",
      data: _.omit(req.user, ["iat", "exp"]),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unexpected Error Occured", error: error });
  }
};

//? Deactivate Profile Handler
const deleteProfile = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      customer_code: req.user.customer_code,
    });
    if (!customer)
      return res
        .status(404)
        .json({ message: "Already Deactivated or No User Found" });
    await Customer.deleteOne({ customer_code: req.user.customer_code });
    await Token.deleteOne({ customer_code: req.user.customer_code });
    return res
      .status(200)
      .json({ message: "Profile Deactivated Successfully." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An Unexpected Error Ocurred.", error: error });
  }
};

module.exports = {
  register: register,
  login: login,
  getProfile: getProfile,
  deleteProfile: deleteProfile,
};
