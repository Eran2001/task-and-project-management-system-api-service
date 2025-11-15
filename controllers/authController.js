import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { sendSuccess, sendError } from "@utils/response.js";
import User from "@models/User.js";

// here is the controller for register user
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

    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return sendSuccess(res, {
      code: "OK",
      data: {
        result: {
          token,
          user: {
            resourceId: newUser._id,
            userName: newUser.username,
            userRole: newUser.role,
          },
        },
      },
      token,
      message: "OK",
      statusCode: 201,
      resourceId: newUser._id,
    });
  } catch (err) {
    return sendError(res, {
      message: "Server error",
      statusCode: 500,
    });
  }
};

// here is the controller for login user
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

    const token = jwt.sign(
      {
        userId: existingUser._id,
        username: existingUser.username,
        role: existingUser.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return sendSuccess(res, {
      code: "OK",
      data: {
        result: {
          token,
          user: {
            resourceId: existingUser._id,
            userName: existingUser.username,
            userRole: existingUser.role,
          },
        },
      },
      message: "OK",
      statusCode: 200,
      resourceId: existingUser._id,
    });
  } catch (err) {
    return sendError(res, {
      message: "Server error",
      statusCode: 500,
    });
  }
};
