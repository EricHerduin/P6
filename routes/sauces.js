const express = require("express");
const router = express.Router();
const multer = require("../middleware/multer-config");

const sauceCtrl = require("../controllers/sauces");
const like = require("../controllers/like");
const auth = require("../middleware/auth");

router.get("/", auth, sauceCtrl.getAllSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/:_id", auth, sauceCtrl.getOneSauce);
router.put("/:_id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:_id", auth, sauceCtrl.deleteSauce);
router.post("/:_id/like", auth, multer, like.likeSauce);

module.exports = router;
