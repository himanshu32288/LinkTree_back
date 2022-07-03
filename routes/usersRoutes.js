const express = require("express");
const { signup, login, verifyEmail } = require("../controllers/AuthController");
const { getUserByUserName } = require("../controllers/usersControllers");
const router = express.Router();

router.get("/:username", getUserByUserName);
router.put("/verify-email", verifyEmail);
router.post("/signup", signup);
router.post("/login", login);
module.exports = router;
