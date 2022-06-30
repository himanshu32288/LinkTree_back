const express = require("express");
const {
  createGroup,
  addLinkToGroup,
  removeLinkfromGrup,
  deleteGroup,
} = require("../controllers/groupControllers");
const checkAuth = require("../middleware/authmiddleware");
const router = express.Router();
router.use(checkAuth);
router.post("/creategroup", createGroup);
router.post("/addlinktogroup", addLinkToGroup);
router.delete("/deletelinkfromgroup", removeLinkfromGrup);
router.delete("/deletegroup", deleteGroup);

module.exports = router;
