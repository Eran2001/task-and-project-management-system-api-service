import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "@models/User.js";
import sendEmail from "@utils/sendEmail.js";
import { sendSuccess, sendError } from "@utils/response.js";

// here is the controller for register user
export const adminRegister = async (req, res) => {
  const {
    username,
    email,
    role,
    organizationName,
    projectName,
    numberOfEmployees,
    departmentName,
  } = req.body;

  if (!email || !role) {
    return sendError(res, {
      code: "BAD_REQUEST",
      message: "Email and role required",
      statusCode: 400,
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return sendError(res, {
        code: "USER_EXISTS",
        message: "User already exists",
        statusCode: 400,
      });

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      username,
      email,
      role,
      organizationName,
      projectName,
      numberOfEmployees,
      departmentName,
      verificationToken,
      isVerified: false,
    });
    await newUser.save();

    // Send verification email
    const verificationLink = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
    await sendEmail(
      email,
      "Verify Your Admin Account",
      `Click here to set your password: ${verificationLink}`
    );

    return sendSuccess(res, {
      code: "OK",
      data: { message: "Verification email sent" },
      statusCode: 201,
    });
  } catch (err) {
    return sendError(res, {
      code: "SERVER_ERROR",
      message: "Server error",
      statusCode: 500,
    });
  }
};

// here is the controller for login user
export const adminLogin = async (req, res) => {
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
