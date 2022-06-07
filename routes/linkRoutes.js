const express = require("express");
const { CreateLink } = require("../controllers/LinkControllers");

const router = express.Router();

router.post("/createlink", CreateLink);

module.exports = router;
