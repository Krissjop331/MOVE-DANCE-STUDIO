const express = require('express');
const router = express.Router();
// const {check} = require('express-validator');

const authRouter = require('./authRouter');
const schedulesRouter = require('./schedulesRouter');


router.use('/auth', authRouter);
router.use('/schedules', schedulesRouter);


module.exports = router;