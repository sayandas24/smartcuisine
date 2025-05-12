import jwt from "jsonwebtoken";

const convertToMin = (str) => {
  const date = new Date(str);
  const currentDate = new Date();
  const mSec = currentDate - date;
  return Math.floor(mSec / (1000 * 60));
};

const getUser = (req) => {
  const access_token = req.headers?.authorization?.split(" ")[1];
  return jwt.verify(access_token, process.env.ACCESS_SECRET);
};

export default { convertToMin, getUser };
