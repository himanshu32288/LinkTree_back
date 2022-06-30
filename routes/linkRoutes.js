const express = require("express");
const {
  createLink,
  deleteLink,
  increaseClick,
  updateLink,
  saveLink,
  getLinksByUserId,
} = require("../controllers/LinkControllers");
const checkAuth = require("../middleware/authmiddleware");
const router = express.Router();
router.get("/getlinks/:userId", getLinksByUserId);
router.use(checkAuth);
router.get("/count/:linkId", increaseClick);
router.patch("/update/:linkId", updateLink);
router.post("/createlink", createLink);
router.delete("/delete", deleteLink);
router.post("/savelink/:linkId", saveLink);

module.exports = router;
