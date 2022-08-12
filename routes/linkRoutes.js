const express = require("express");
const {
  createLink,
  deleteLink,
  increaseClick,
  updateLink,
  saveLink,
  getLinksByUserId,
  getLinksByUserName,
  getSavedLinks,
} = require("../controllers/LinkControllers");
const checkAuth = require("../middleware/authmiddleware");
const router = express.Router();
router.get("/getlinks/:userId", getLinksByUserId);
router.get("/getlinksbyusername/:username", getLinksByUserName);
router.use(checkAuth);
router.get("/count/:linkId", increaseClick);
router.patch("/update/:linkId", updateLink);
router.post("/createlink", createLink);
router.delete("/delete", deleteLink);
router.get("/savelink/:linkId", saveLink);
router.get("/getsavedlinks", getSavedLinks);

module.exports = router;
