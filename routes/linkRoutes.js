const express = require("express");
const { createLink, deleteLink } = require("../controllers/LinkControllers");

const router = express.Router();

router.post("/createlink", createLink);
router.delete("/delete", deleteLink);
module.exports = router;
