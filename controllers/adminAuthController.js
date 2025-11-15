import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import Admin from "@models/adminModel.js";
import sendEmail from "@utils/sendEmail.js";
import { sendSuccess, sendError } from "@utils/response.js";

export const registerAdmin = async (req, res) => {
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
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return sendError(res, {
        code: "USER_EXISTS",
        message: "Admin already exists",
        statusCode: 400,
      });

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newAdmin = new Admin({
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

    await newAdmin.save();

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
    console.error(err);
    return sendError(res, {
      code: "SERVER_ERROR",
      message: "Server error",
      statusCode: 500,
    });
  }
};

export const verifyAdmin = async (req, res) => {
  const { token, password } = req.body;

  try {
    const admin = await Admin.findOne({ verificationToken: token });
    if (!admin)
      return sendError(res, {
        code: "INVALID_TOKEN",
        message: "Invalid or expired token",
        statusCode: 400,
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    admin.password = hashedPassword;
    admin.isVerified = true;
    admin.verificationToken = null;

    await admin.save();

    return sendSuccess(res, {
      code: "OK",
      data: { message: "Password set successfully" },
      statusCode: 200,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, {
      code: "SERVER_ERROR",
      message: "Server error",
      statusCode: 500,
    });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return sendError(res, {
      code: "BAD_REQUEST",
      message: "Email and password required",
      statusCode: 400,
    });

  try {
    const admin = await Admin.findOne({ email });
    if (!admin)
      return sendError(res, {
        code: "NOT_FOUND",
        message: "Admin not found",
        statusCode: 404,
      });

    if (!admin.isVerified)
      return sendError(res, {
        code: "NOT_VERIFIED",
        message: "Please verify your email first",
        statusCode: 403,
      });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return sendError(res, {
        code: "UNAUTHORIZED",
        message: "Invalid password",
        statusCode: 401,
      });

    const token = jwt.sign(
      { userId: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return sendSuccess(res, {
      code: "OK",
      data: {
        result: {
          token,
          user: {
            resourceId: admin._id,
            userName: admin.username,
            userRole: admin.role,
          },
        },
      },
      statusCode: 200,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, {
      code: "SERVER_ERROR",
      message: "Server error",
      statusCode: 500,
    });
  }
};
