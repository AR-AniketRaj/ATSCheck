const {
  Signup,
  Login,
  Logout,
  ForgotPassword,
  ResetPassword,
  VerifyOTP,
} = require("../controllers/AuthController");
const router = require("express").Router();
const { userVerification } = require("../middleware/AuthMiddleware");

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password", ResetPassword);
router.post("/verify-otp", VerifyOTP);
router.post("/", userVerification);

module.exports = router;
