import jwt from "jsonwebtoken";
import "dotenv/config";

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const createUserModel = (user) => {
  return {
    user: user.email,
    uid: user.uid,
    username: user.username,
    name: user.name,
    verified: user.verified,
    role: user.role,
  };
};
const generateAccessToken = (user) => {
  return jwt.sign(createUserModel(user), ACCESS_SECRET, { expiresIn: "10m" });
};

const generateRefreshToken = (user) => {
  return jwt.sign(createUserModel(user), REFRESH_SECRET, { expiresIn: "30d" });
};

const setCookies = (res, key, value, days) => {
  res.cookie(key, value, {
    httpOnly: true,
    secure: process.env.SSL === "true",
    maxAge: days * 24 * 60 * 60 * 1000,
    sameSite: "None",
  });
};

export default { generateAccessToken, generateRefreshToken, setCookies };
