import User from "../model/user.model.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user already exist",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not registered",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.verificationToken = token;

    await user.save();
    const msg = "please click on the following link to verify your email";
    const route = `users/verify/${token}`;
    await sendEmail(msg, user.email, route);

    res.status(200).json({
      success: true,
      message: "user registered successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "user not registerd",
      error,
    });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Invalid token or No token",
      });
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "user verifed",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid token",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "all fields required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not registerd",
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const cookieOption = {
      httpOnly: true,
      secure: true, 
      sameSite: "none", 
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOption);
    res.status(200).json({
      success: true,
      message: "Login Successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "invalid login",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "get me failed",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      expires: new Date(0),
    });
    res.status(200).json({
      success: false,
      message: "logout successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "logout failed",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "all fields required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "email is not registerd",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    const msg = "please click on following link to reset your password";
    const route = `users/reset/${resetToken}`;

    await sendEmail(msg, user.email, route);

    return res.status(200).json({
      success: true,
      message: "reset link has been sent check your inbox",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "something went wrong",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "missing token or password",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "invalid or expired reset link",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    return res.status(200).json({
      success: true,
      message: "password reset successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "password reset failed",
    });
  }
};

export {
  registerUser,
  verifyUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  logoutUser,
};
