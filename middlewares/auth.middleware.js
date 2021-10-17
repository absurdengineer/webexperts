const jwt = require("jsonwebtoken");
const Token = require("../models/token.model");

module.exports = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).send(`Access Denied : No Token Provided!!!`);
  try {
    const decoded = jwt.verify(token, process.env.JSONPRIVATEKEY);
    const dbtoken = await Token.findOne({
      customer_code: decoded.customer_code,
      token: token,
    });
    if (!dbtoken)
      return res
        .status(401)
        .send(`Access Denied : Token has been Refreshed!!!`);
    req.user = decoded;
    next();
  } catch ({ name }) {
    return res.status(400).send(`${name} : Invalid Token!!!`);
  }
};
