import auth from "../../models/v1/auth.model.js";
import validator from "../../validations/user.validations.js";
import authUtil from "../../utils/auth.js";
import jwt from "jsonwebtoken";
import { response } from "express";

// Global variables
let validationError = null;

const signup = async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      profile_pic,
      password,
      refresh_token,
      provider,
      verified,
    } = req.body;
    validationError = validator.validateUserInput(
      username,
      name,
      email,
      password,
      profile_pic
    );
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const response = await auth.signup(
      username,
      name,
      email,
      profile_pic,
      password,
      refresh_token,
      provider,
      verified
    );

    // MySQL error or system error
    if (response.status === false) {
      return res.status(400).json(response);
    }

    res
      .status(201)
      .json({ status: true, message: "User created!", user: { response } });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: `Internal server error : ${error.message} `,
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = req.admin || false;
    const response = await auth.login(email, password, admin);

    if (response.status === false) {
      return res.status(400).json(response);
    }

    // saving the access token in the cookies
    authUtil.setCookies(res, "access_token", response.access_token, 7);
    authUtil.setCookies(res, "refresh_token", response.refresh_token, 30);
    // sending the api response
    res.status(200).json({
      status: true,
      message: "Login successful.",
      user: {
        uid: response.uid,
        email: response.email,
        username: response.username,
        name: response.name,
        verified: response.verified,
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      },
    });
  } catch (error) {
    return { status: false, error: ` ${error.message}` };
  }
};

// Refresh token

const refresh = async (req, res) => {
  let refresh_token = req.headers?.authorization?.split(" ")[1];
  try {
    const users = jwt.verify(refresh_token, process.env.REFRESH_SECRET);
    const newAccessToken = authUtil.generateAccessToken(users);
    authUtil.setCookies(res, "access_token", newAccessToken, 7);
    res
      .status(200)
      .json({ status: true, refresh_token, access_token: newAccessToken });
  } catch (error) {
    res
      .status(401)
      .json({ status: false, error: "Token expired, please login again" });
  }
};

export default { login, signup, refresh };
