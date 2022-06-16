const express = require("express");
const { signup } = require("../controllers/AuthController");
const { getUserById } = require("../controllers/usersControllers");
const router = express.Router();

router.post("/signup", signup);
router.get("/:userId", getUserById);
module.exports = router;
