const express = require("express");
const { CreateLink, DeleteLink } = require("../controllers/LinkControllers");

const router = express.Router();

router.post("/createlink", CreateLink);
router.delete("/delete", DeleteLink);
module.exports = router;
