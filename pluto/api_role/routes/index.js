
"use strict";

const express = require('express');
const router = express.Router();


     
const roleconfigRoute = require('./roleconfigRouter.js');
router.use(roleconfigRoute);
    


module.exports = router;