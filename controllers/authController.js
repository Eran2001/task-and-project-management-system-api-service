import bcrypt from "bcrypt";

import { sendSuccess, sendError } from "../utils/response.js";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return sendError(res, {
      code: "BAD_REQUEST",
      message: "Username, password, and role are required",
      statusCode: 400,
    });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return sendError(res, {
        code: "USER_EXISTS",
        message: "Username already exists",
        statusCode: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    return sendSuccess(res, {
      code: "OK",
      result: true,
      message: "OK",
      statusCode: 201,
      resourceId: newUser._id,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, {
      message: "Server error",
      statusCode: 500,
    });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return sendError(res, {
      code: "BAD_REQUEST",
      message: "Username and password are required",
      statusCode: 400,
    });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return sendError(res, {
        code: "NOT_FOUND",
        message: "User not found",
        statusCode: 404,
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return sendError(res, {
        code: "UNAUTHORIZED",
        message: "Invalid password",
        statusCode: 401,
      });
    }

    return sendSuccess(res, {
      result: {
        username: existingUser.username,
        role: existingUser.role,
      },
      message: `Welcome back ${existingUser.username} (${existingUser.role})`,
      statusCode: 200,
      resourceId: existingUser._id,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, {
      message: "Server error",
      statusCode: 500,
    });
  }
};
