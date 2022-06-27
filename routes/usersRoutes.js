const express = require("express");
const { signup, login } = require("../controllers/AuthController");
const { getUserByUserName } = require("../controllers/usersControllers");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/:username", getUserByUserName);
module.exports = router;
