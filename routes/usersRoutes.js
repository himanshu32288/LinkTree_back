const express = require("express");
const { signup } = require("../controllers/AuthController");
const { getUserByUserName } = require("../controllers/usersControllers");
const router = express.Router();

router.post("/signup", signup);
router.get("/:username", getUserByUserName);
module.exports = router;
