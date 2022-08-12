const express = require("express");
const { signup, login, verifyEmail } = require("../controllers/AuthController");
const {
  getUserByUserName,
  updateUserDetails,
} = require("../controllers/usersControllers");
const router = express.Router();

router.get("/:username", getUserByUserName);
router.put("/verify-email", verifyEmail);
router.post("/updatedetails", updateUserDetails);
router.post("/signup", signup);
router.post("/login", login);
module.exports = router;
