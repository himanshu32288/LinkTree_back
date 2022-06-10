const express = require("express");
const {
  createLink,
  deleteLink,
  increaseClick,
  updateLink,
  saveLink,
  createGroup,
  addLinkToGroup,
} = require("../controllers/LinkControllers");

const router = express.Router();

router.get("/count/:linkId", increaseClick);
router.patch("/update/:linkId", updateLink);
router.post("/createlink", createLink);
router.delete("/delete", deleteLink);
router.post("/savelink/:linkId", saveLink);
router.post("/creategroup", createGroup);
router.post("/addlinktogroup", addLinkToGroup);
module.exports = router;
