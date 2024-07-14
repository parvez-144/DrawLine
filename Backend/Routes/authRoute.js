const express = require("express");
const {Login,Signup}=require("../Controller/authController")
const{userVerification}= require("../Middlewares/authMiddleware")
const router = require("express").Router();

router.post("/Signup", Signup);
router.post("/Login",Login);
router.post('/',userVerification)


module.exports = router;