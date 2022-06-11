const express = require("express");
const {
  createLink,
  deleteLink,
  increaseClick,
  updateLink,
  saveLink,
} = require("../controllers/LinkControllers");

const router = express.Router();

router.get("/count/:linkId", increaseClick);
router.patch("/update/:linkId", updateLink);
router.post("/createlink", createLink);
router.delete("/delete", deleteLink);
router.post("/savelink/:linkId", saveLink);

module.exports = router;
