const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const AuthController = require("../controllers/AuthController");
const AuthMiddleware = require("../midlleware/authMiddleware");

router.get('/users', upload.none(), AuthController.getUsers);
router.post('/signin', upload.none(), AuthController.signIn);
router.post('/signup',  AuthMiddleware, upload.none(), AuthController.signUp);
router.post('/signout',  upload.none(), AuthController.signOut);

module.exports = router;

