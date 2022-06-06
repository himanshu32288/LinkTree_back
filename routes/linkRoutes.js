const express = require("expres");
const { CreateLink } = require("../controllers/LinkControllers");

const router = express.Router();

router.get("/createlink", CreateLink);
