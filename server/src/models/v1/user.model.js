import pool from "../../config/db.connection.js";
import { v4 as uuidv4 } from "uuid";

// Delete existing user
const deleteUser = async (uid, password) => {
  let q = `SELECT password FROM Users WHERE uid = ?`;
  let [result] = await pool.query(q, [uid]);

  if (result.length === 0) {
    return { status: false, error: "User not found." };
  }
  if (password != result[0].password) {
    return { status: false, error: "Invalid password." };
  }
  q = "DELETE FROM Users WHERE uid = ?";
  return await pool.query(q, [uid]);
};

//Get User

const getUser = async (uid) => {
  let q, result;
  q = "SELECT * FROM Users WHERE uid = ?";
  result = await pool.query(q, [uid]);
  if (result[0].length == 0) {
    return {
      status: false,
      error: "Unable to access user data. Please check the request!",
      uid,
    };
  }
  result = result[0][0];
  delete result.password;

  return { status: true, user: result };
};

// Update user Info
const updateUser = async (data) => {
  try {
    const updateFields = Object.keys(data.params);
    const updateValues = Object.values(data.params);
    let q = "SELECT * FROM Users WHERE uid = ? ";
    let result = await pool.query(q, data.uid);
    if (result[0].length === 0) {
      return { status: false, error: "User not found." };
    }

    q = `UPDATE Users SET ${updateFields.join(" = ?, ")} = ? WHERE uid = '${
      data.uid
    }'`;

    result = await pool.query(q, updateValues);

    if (result[0].affectedRows < 0) {
      return { status: true, message: "No changes were made." };
    }
    return { status: true, message: "Update successful." };
  } catch (error) {
    return { status: false, message: "SQL error : " + error };
  }
};

const verifyUser = async (data) => {
  try {
    const { code, uid } = data;
    let q, result;
    q = "SELECT verified FROM Users WHERE uid = ?"; // Chaking for the user status
    result = await pool.query(q, [uid]);
    if (!result[0][0]) return { status: false, error: "User not found." };

    if (result[0][0].verified == 1)
      return { status: false, error: "User already verified." };

    result = result[0][0].verified;
    q = "SELECT code FROM Otps WHERE uid = ? AND code = ? LIMIT 1";
    result = await pool.query(q, [uid, code]);

    if (result[0].length === 0)
      return { status: false, error: "Invalid code." };
    q = "UPDATE Users SET verified = 1 WHERE uid = ?";
    result = await pool.query(q, [uid]);

    // Deleting the code from the database after verification.
    q = "DELETE FROM Otps WHERE code = ?";
    result = await pool.query(q, [code]);

    return { status: true, message: "User has been verified." };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const generateOTP = async (data) => {
  const uid = data;
  let q, result;
  const OTP = Math.floor(100000 + Math.random() * 900000); // Generating 6 Digit random number
  q = "SELECT email, verified FROM Users WHERE uid = ?";

  result = await pool.query(q, [uid]);
  result = result[0];

  if (result.length == 0) {
    return { status: false, error: "User not found." };
  }

  if (result[0].verified == 1) {
    return { status: false, error: "User already verified." };
  }

  q = "SELECT * FROM Otps WHERE uid = ? LIMIT 1";
  result = await pool.query(q, [uid]);

  // if (result[0].length >= 1) {
  //   return { status: false, error: "Otp has already been sent to your email." };
  // }

  q = "INSERT INTO  Otps (uid , code) VALUES(?, ?)";
  result = await pool.query(q, [uid, OTP]);
  return {
    status: true,
    message: "We have sent a 6-digit code to your email.",
    verification: {
      code: OTP,
    },
  };
};

const checkUser = async (email) => {
  try {
    let q = "SELECT verified FROM Users WHERE email = ?";

    let [result] = await pool.query(q, email);

    if (result.length === 0)
      return {
        status: false,
        statusCode: 400,
        error: "The user you are trying to access does not exist.",
      };
    return {
      status: true,
      statusCode: 200,
      message: "The user exists and is valid.",
    };
  } catch (error) {
    return {
      status: true,
      statusCode: 500,
      error: error.message,
    };
  }
};
export default {
  deleteUser,
  updateUser,
  verifyUser,
  generateOTP,
  getUser,
  checkUser,
};
