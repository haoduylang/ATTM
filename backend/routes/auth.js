const express = require('express');
const authController = require("../controllers/authControllers");
const router = express.Router();

//REGISTER
router.post("/register", authController.register);

//LOGIN
router.post("/loginUser", authController.loginUser);
module.exports = router; 