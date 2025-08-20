const express = require("express");
const router = express.Router();
const {createQuery,getAllquerry,ReplyMessage}=require("../controllers/querry_controller");
const adminmiddleware=require("../middleware/admin_middleware");

router.post("/add",createQuery)
router.get("/admin/get",adminmiddleware,getAllquerry)
router.post("/admin/reply/:id",adminmiddleware,ReplyMessage)

module.exports = router;