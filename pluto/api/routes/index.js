
"use strict";

const express = require('express');
const router = express.Router();



     
const productRoute = require('./productRouter.js');
router.use(productRoute);
    
const factoryRoute = require('./factoryRouter.js');
router.use(factoryRoute);
     
const productprofileRoute = require('./productprofileRouter.js');
router.use(productprofileRoute);
    
const scanRoute = require('./scanRouter.js');
router.use(scanRoute);
     
const productprofilesignatureRoute = require('./productprofilesignatureRouter.js');
router.use(productprofilesignatureRoute);
    

     
const imagesRoute = require('./imagesRouter.js');
router.use(imagesRoute);
    

     
const manufacturerRoute = require('./manufacturerRouter.js');
router.use(manufacturerRoute);
    

     
const retailerRoute = require('./retailerRouter.js');
router.use(retailerRoute);
    

     
const tagsupplierRoute = require('./tagsupplierRouter.js');
router.use(tagsupplierRoute);
    

    

     
const tagRoute = require('./tagRouter.js');
router.use(tagRoute);
    

     
const brandRoute = require('./brandRouter.js');
router.use(brandRoute);
    

     
const transactionRoute = require('./transactionRouter.js');
router.use(transactionRoute);
    

const emailRoute = require('./emailRouter.js');
router.use(emailRoute);
    


module.exports = router;