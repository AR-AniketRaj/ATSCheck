const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const brevo = require("@getbrevo/brevo");

module.exports.Signup = async (req, res) => {
  try {
    const { email, password, username, createdAt } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Generate 6-digit OTP
    const verificationOTP = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // OTP expires after 10 minutes
    const verificationOTPExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Create user
    const user = await User.create({
      email,
      password,
      username,
      createdAt,
      isVerified: false,
      verificationOTP,
      verificationOTPExpires,
    });

    // Configure Brevo
    const brevoClient = new brevo.BrevoClient({
      apiKey: process.env.BREVO_API_KEY,
    });

    // Send OTP email
    await brevoClient.transactionalEmails.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME,
      },

      to: [
        {
          email: user.email,
          name: user.username,
        },
      ],

      subject: "Verify Your ATSCheck Account",

      htmlContent: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 20px;
        ">

          <h2 style="color: #2563eb;">
            ATSCheck
          </h2>

          <p>Hello ${user.username},</p>

          <p>
            Thank you for creating an ATSCheck account.
          </p>

          <p>
            Your email verification OTP is:
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #2563eb;
            margin: 25px 0;
          ">
            ${verificationOTP}
          </div>

          <p>
            This OTP will expire in
            <strong>10 minutes</strong>.
          </p>

          <p>
            If you did not create an ATSCheck account,
            you can safely ignore this email.
          </p>

          <p>
            Regards,<br />
            ATSCheck Team
          </p>

        </div>
      `,
    });

    console.log("Verification OTP sent to:", user.email);
    console.log("OTP:", verificationOTP);

    return res.status(201).json({
      success: true,
      message:
        "Account created successfully. Please check your email for the verification OTP.",
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create account.",
    });
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Incorrect password or email" });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Incorrect password or email" });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User logged in successfully", success: true });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Logout = (req, res) => {
  res.clearCookie("token");

  return res.json({
    success: true,
    message: "Logged out successfully",
  });
};

module.exports.ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Token expires after 5 minutes
    const resetTokenExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;

    await user.save();

    console.log("RESET TOKEN:", resetToken);
    console.log("RESET EXPIRY:", resetTokenExpires);
    console.log("SAVED TOKEN:", user.resetPasswordToken);
    console.log("SAVED EXPIRY:", user.resetPasswordExpires);

    // Create password reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Configure Brevo
    const brevoClient = new brevo.BrevoClient({
      apiKey: process.env.BREVO_API_KEY,
    });

    // Send email through Brevo
    await brevoClient.transactionalEmails.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME,
      },

      to: [
        {
          email: user.email,
          name: user.username,
        },
      ],

      subject: "Reset Your ATSCheck Password",

      htmlContent: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 20px;
        ">

          <h2 style="color: #2563eb;">
            ATSCheck
          </h2>

          <p>Hello ${user.username},</p>

          <p>
            We received a request to reset your ATSCheck password.
          </p>

          <p>
            Click the button below to create a new password:
          </p>

          <a
            href="${resetLink}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background-color: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Reset Password
          </a>

          <p style="margin-top: 20px;">
            This link will expire in <strong>5 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset,
            you can safely ignore this email.
          </p>

          <p>
            Regards,<br />
            ATSCheck Team
          </p>

        </div>
      `,
    });

    console.log("Password reset email sent to:", user.email);

    return res.status(200).json({
      success: true,
      message: "Password reset email sent successfully.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send password reset email.",
    });
  }
};

module.exports.ResetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required.",
      });
    }

    // Find user with this reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or has expired.",
      });
    }

    // Set new password
    user.password = password;

    // Remove reset token after successful password reset
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reset password.",
    });
  }
};

module.exports.VerifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified.",
      });
    }

    // Check OTP
    if (user.verificationOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // Check OTP expiry
    if (
      !user.verificationOTPExpires ||
      user.verificationOTPExpires < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Verify email
    user.isVerified = true;

    // Remove OTP after successful verification
    user.verificationOTP = null;
    user.verificationOTPExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP.",
    });
  }
};
