const express = require("express");
const auth = require('../authentication/auth');
const router = express.Router();
const loginCon = require("../controllers/user");;
router.post("/user/signup", loginCon.signup);
// router.get('/user/login',loginCon.login);
// router.post('/user/login',loginCon.loginvalidate);
// router.get('/user/login',loginCon.loginget);
router.post("/user/login", loginCon.logincheck);




module.exports = router;
