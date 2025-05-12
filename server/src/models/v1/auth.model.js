import pool from "../../config/db.connection.js";
import { v4 as uuidv4 } from "uuid";
import authUtil from "../../utils/auth.js";
//Create a new user
const signup = async (
  username,
  name,
  email,
  profile_pic,
  password,
  refresh_token,
  provider,
  verified
) => {
  const q =
    "INSERT INTO Users(uid, username, name, email, profile_pic , password, refresh_token, provider, verified) VALUES(?, ? , ? , ? , ? , ?, ? , ?, ?)";
  const uid = uuidv4();
  try {
    const result = await pool.query(q, [
      uid, // Creating a random UserID using UUID library
      username,
      name,
      email,
      profile_pic,
      password,
      refresh_token,
      provider || 0, // default provider 0 (Google OAuth)
      verified || 1, // default email will be verified
    ]);

    return { uid, username, email, profile_pic, refresh_token, verified };
  } catch (error) {
    return { status: false, error: `SQL Error : ${error.message}` };
  }
};

// Get user use as login
const login = async (email, password, admin) => {
  try {
    let q =
      "SELECT email, password, uid, refresh_token, username, name, verified, role FROM Users WHERE email = ? AND role = ? ";

    let [result] = await pool.query(q, [email, admin]);
    if (result.length === 0)
      return {
        status: false,
        error: admin
          ? "User does not exist with this email address or doesn't have sufficient permission"
          : "User does not exist with this email address.",
      };

    if (result[0].password != password)
      return { status: false, error: "Incorrect password" };

    let userData = result[0];

    q = "UPDATE Users SET access_token = ? , refresh_token = ? WHERE uid = ?";

    //Generating tokens
    const access_token = authUtil.generateAccessToken(userData);
    const refresh_token = authUtil.generateRefreshToken(userData);
    result = await pool.query(q, [access_token, refresh_token, userData.uid]);
    userData = { ...userData, access_token, refresh_token };
    return userData;
  } catch (error) {
    return { status: false, error: `SQL Error : ${error}` };
  }
};

export default { signup, login };
