const jwt = require("jsonwebtoken");
const Driver = require("../model/Driver_model");
const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "").trim();
  if (!token)
    return res.status(401).json({ message: "No token, access denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Driver.findById(decoded.id).select("-password");
    if (!user) {
     return  res.status(401).json({ error: "No user Found" });
    }

    req.driver = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
module.exports = authenticate;
