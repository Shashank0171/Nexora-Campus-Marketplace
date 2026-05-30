import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserTypeModel } from "../models/UserModel.js";
import { config } from "dotenv";

config();


// Register User
export const register = async (userObj) => {
  const existingUser = await UserTypeModel.findOne({
    email: userObj.email.toLowerCase(),
  });

  if (existingUser) {
    const err = new Error("User already exists");
    err.status = 400;
    throw err;
  }

  // Allow only college emails
  if (!userObj.email.endsWith("@anurag.edu.in")) {
    const err = new Error(
      "Only @anurag.edu.in emails are allowed"
    );
    err.status = 400;
    throw err;
  }

  userObj.email = userObj.email.toLowerCase();

  // New users require admin approval
  userObj.isApproved = false;
  userObj.isVerified = true;
  userObj.role = userObj.role || "student";

  const userDoc = new UserTypeModel(userObj);

  await userDoc.validate();

  userDoc.password = await bcrypt.hash(
    userDoc.password,
    10
  );

  const createdUser = await userDoc.save();

  const newUserObj = createdUser.toObject();

  delete newUserObj.password;

  return newUserObj;
};


// Login User
export const authenticate = async ({
  email,
  password,
}) => {
  const user = await UserTypeModel.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    const err = new Error(
      "Invalid email or password"
    );
    err.status = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    const err = new Error(
      "Invalid email or password"
    );
    err.status = 401;
    throw err;
  }

  // Account blocked by admin
  if (!user.isActive) {
    const err = new Error(
      "Account is blocked. Contact admin."
    );
    err.status = 403;
    throw err;
  }

  // Account not approved yet
  if (
    user.role !== "admin" &&
    !user.isApproved
  ) {
    const err = new Error(
      "Your account is pending admin approval."
    );
    err.status = 403;
    throw err;
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  const userObj = user.toObject();

  delete userObj.password;

  return {
    token,
    user: userObj,
  };
};