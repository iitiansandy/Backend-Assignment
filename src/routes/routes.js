const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");


/* ++++++++++++++++++++++++++ User APIs ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

router.post("/user", userController.createUser);
router.get("/user", userController.getUser);
router.put("/user/:userId", userController.updateUser);
router.delete("/user/:userId", userController.deleteUser);


module.exports = router;