/**
 * Copyright 2018 IT People Corporation. All Rights Reserved.
 *
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

let express = require('express');
let chainUtil = require('../helpers/fabric-helper.js');
let logger = chainUtil.getLogger('Product-API');
let config = require('config');
let helper = require('../helpers/helper.js');
let imagesController = require('./imagesController.js')
let OrderedUUID = require("ordered-uuid");
let shell = require('shelljs')
let path = require('path')
let fs = require('fs')
let util = require('util');
let unlink = util.promisify(fs.unlink)
var randomize = require('randomatic');

exports.recordProduct = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    try {
        req
            .checkBody("skuID")
            .notEmpty()
            .withMessage("Field cannot be empty")
            .trim();
        req
            .checkBody("upCode")
            .notEmpty()
            .withMessage("Field cannot be empty")
            .trim();
        req
            .checkBody("styleID")
            .notEmpty()
            .withMessage("Field cannot be empty")
            .trim();
        req
            .checkBody("factoryID")
            .notEmpty()
            .withMessage("Field cannot be empty")
            .trim();
        req
            .checkBody("color")
            .notEmpty()
            .withMessage("Field cannot be empty")
            .trim();
        req
            .checkBody("msrp")
            .notEmpty()
            .withMessage("Field cannot be empty")
            .trim();
        req
            .checkBody("brandID")
            .notEmpty()
            .withMessage("Field cannot be empty")
            .trim();
        let errors = req.validationErrors({
            onlyFirstError: true
        });
        if (errors) {
            throw errors;
        }
    } catch (err) {
        return res.status(400).send(err);
    }


    let productID = req.body.brandID + "ITEM" + randomize('0', 4)

    let manufactureDate = new Date();
    let productJSON = {
        productID: productID,
        skuID: req.body.skuID,
        upCode: req.body.upCode,
        styleID: req.body.styleID,
        factoryID: req.body.factoryID,
        color: req.body.color,
        msrp: req.body.msrp,
        brandID: req.body.brandID,
        manufactureDate: manufactureDate,
        manufacturerID: res.locals.decoded._id,
        imageIDs: []
    }

    let imageJSON = {};
    let jsonArr = [];
    let method = "recordProduct";

    logger.info('called chaincode for method : ', method);
    productJSON.ObjectType = "Product"

    if (req.files.image != null) {

        let imageID = OrderedUUID.generate()
        let imageName = req.files.image.name
        let imageType = req.files.image.mimetype
        var base64Image = new Buffer(req.files.image.data).toString('base64');

        imageJSON = {
            imageID: imageID,
            imageName: imageName,
            imageType: imageType,
            imageString: base64Image,
            description: req.body.description
        }

        productJSON.imageIDs.push(imageID)
    }

    jsonArr.push(JSON.stringify(productJSON));
    jsonArr.push(JSON.stringify(imageJSON));

    let result;
    try {
        result = await chainUtil.invokeTransaction(config.channelName, config.chaincodeName, jsonArr, method, req.decoded.email, req.decoded.orgName, "");
    } catch (err) {
        return helper.sendResponse(res, null, err);
    }
    return helper.sendResponse(res, result, null);

}

exports.queryUntaggedProductsbyBrand = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryUntaggedProductsbyBrand";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Product"
    argsJSON.brandID = req.params.brandID

    let jsonArr = [];
    jsonArr.push(JSON.stringify(argsJSON));

    let result;
    try {
        result = await chainUtil.queryChaincode(config.channelName, config.chaincodeName, jsonArr, method, req.decoded.email, req.decoded.orgName);
    } catch (err) {
        return helper.sendResponse(res, null, err);
    }
    return helper.sendResponse(res, result, null);
}

exports.queryUnshippedProducts = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryUnshippedProducts";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Product"
    argsJSON.factoryID = res.locals.decoded._id

    let jsonArr = [];
    jsonArr.push(JSON.stringify(argsJSON));

    let result;
    try {
        result = await chainUtil.queryChaincode(config.channelName, config.chaincodeName, jsonArr, method, req.decoded.email, req.decoded.orgName);
    } catch (err) {
        return helper.sendResponse(res, null, err);
    }
    return helper.sendResponse(res, result, null);
}

exports.updateProduct = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = req.body;
    let method = "updateProduct";
    let shippedDate = new Date();

    logger.info('called chaincode for method : ', method);
    argsJSON.ObjectType = "Product";
    argsJSON.productID = req.body.productID
    argsJSON.orderNumber = req.body.orderNumber
    argsJSON.retailerID = req.body.retailerID
    argsJSON.shippedDate = shippedDate

    let jsonArr = [];
    jsonArr.push(JSON.stringify(argsJSON));

    let result;
    try {
        result = await chainUtil.invokeTransaction(config.channelName, config.chaincodeName, jsonArr, method, req.decoded.email, req.decoded.orgName, "");
    } catch (err) {
        return helper.sendResponse(res, null, err);
    }
    return helper.sendResponse(res, result, null);
}

exports.queryProduct = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryProduct";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Product"
    argsJSON.ProductID = req.params.productid

    let jsonArr = [];
    jsonArr.push(JSON.stringify(argsJSON));

    let result;
    try {
        result = await chainUtil.queryChaincode(config.channelName, config.chaincodeName, jsonArr, method, req.decoded.email, req.decoded.orgName);
    } catch (err) {
        return helper.sendResponse(res, null, err);
    }
    return helper.sendResponse(res, result, null);
}

exports.saleScanTag = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryProduct";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Product"
    argsJSON.ProductID = req.params.productid

    let jsonArr = [];
    jsonArr.push(JSON.stringify(argsJSON));

    try {
        let productDetails = await chainUtil.queryChaincode(config.channelName, config.chaincodeName, jsonArr, method, req.decoded.email, req.decoded.orgName);
        productDetailsObject = JSON.parse(productDetails);
        if (productDetailsObject.status = "SUCCESS") {
            let product = JSON.parse(productDetailsObject.objectBytes).product;
            logger.info("Now querying with tagID:", product.tagID);
            let tagDetails = await queryTag(product.tagID, req.decoded.email, req.decoded.orgName);
            tagDetailsObject = JSON.parse(tagDetails);

            let tagObject = JSON.parse(tagDetailsObject.objectBytes);
            logger.debug("Found tag status :", tagObject, tagObject.status);
            if (tagObject.status == "activated") {
                return helper.sendResponse(res, productDetails, null);
            } else if (tagObject.status == "deactivated") {
                logger.debug("Product:%s already sold", argsJSON.ProductID);
                return res.status(400).json({
                    "success": false,
                    "message": "Product already sold"
                });
            } else {
                logger.info("Product:%s not found", argsJSON.ProductID);
                return res.status(404).json({
                    "success": false,
                    "message": "Product not found"
                });
            }
        } else {
            logger.info("No product found with id: %s", argsJSON.ProductID);
            return res.status(404).json({
                "success": false,
                "message": "Product not found"
            });
        }
    } catch (err) {
        logger.error("Failed to query product.", argsJSON, err);
        return helper.sendResponse(res, null, err);
    }
}

async function queryTag(tagID, email, orgName) {
    logger.info("Querying tag...", tagID);
    let argsJSON = {};
    let method = "queryTag";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Tag"
    argsJSON.TagID = tagID;

    let jsonArr = [];
    jsonArr.push(JSON.stringify(argsJSON));

    try {
        let result = await chainUtil.queryChaincode(config.channelName, config.chaincodeName, jsonArr, method, email, orgName);
        return result;
    } catch (err) {
        logger.error("Failed to query tag.", err, tagID);
        throw err;
    }
}

exports.queryProductbyRetailer = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryProductbyRetailer";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Product"
    argsJSON.retailerID = res.locals.decoded._id

    let jsonArr = [];
    jsonArr.push(JSON.stringify(argsJSON));

    let result;
    try {
        result = await chainUtil.queryChaincode(config.channelName, config.chaincodeName, jsonArr, method, req.decoded.email, req.decoded.orgName);
    } catch (err) {
        return helper.sendResponse(res, null, err);
    }
    return helper.sendResponse(res, result, null);
}

exports.queryProductHistory = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryProductHistory";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Product"
    argsJSON.ProductID = req.params.ProductID

    let jsonArr = [];
    jsonArr.push(JSON.stringify(argsJSON));

    let result;
    try {
        result = await chainUtil.queryChaincode(config.channelName, config.chaincodeName, jsonArr, method, req.decoded.email, req.decoded.orgName);
    } catch (err) {
        return helper.sendResponse(res, null, err);
    }
    return helper.sendResponse(res, result, null);
}

exports.queryProductList = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryProductList";
    let resultPromise;

    logger.info('called chaincode for method : ', method);
    argsJSON.ObjectType = "Product";

    let jsonArr = [];
    jsonArr.push(JSON.stringify(argsJSON));

    let result;
    try {
        result = await chainUtil.queryChaincode(config.channelName, config.chaincodeName, jsonArr, method, req.decoded.email, req.decoded.orgName);
    } catch (err) {
        return helper.sendResponse(res, null, err);
    }
    return helper.sendResponse(res, result, null);
}

exports.queryProductsByBrand = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryProductsbyBrand";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Product"
    argsJSON.brandID = req.params.brandID

    let jsonArr = [];
    jsonArr.push(JSON.stringify(argsJSON));

    let result;
    try {
        result = await chainUtil.queryChaincode(config.channelName, config.chaincodeName, jsonArr, method, req.decoded.email, req.decoded.orgName);
    } catch (err) {
        return helper.sendResponse(res, null, err);
    }
    return helper.sendResponse(res, result, null);
}

exports.deleteProduct = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "deleteProduct";
    let resultPromise;

    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Product";
    argsJSON.ProductID = req.params.ProductID

    let jsonArr = [];
    jsonArr.push(JSON.stringify(argsJSON));

    let result;
    try {
        result = await chainUtil.invokeTransaction(config.channelName, config.chaincodeName, jsonArr, method, req.decoded.email, req.decoded.orgName, "");
    } catch (err) {
        return helper.sendResponse(res, null, err);
    }
    return helper.sendResponse(res, result, null);
}

exports.assignTagtoProduct = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "assignTagtoProduct";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Product"
    argsJSON.ProductID = req.body.productID
    argsJSON.TagID = req.body.tagID
    argsJSON.TagTechnology = req.body.tagTechnology

    let jsonArr = [];
    jsonArr.push(JSON.stringify(argsJSON));


    let result;
    try {
        result = await chainUtil.invokeTransaction(config.channelName, config.chaincodeName, jsonArr, method, req.decoded.email, req.decoded.orgName, "");
    } catch (err) {
        return helper.sendResponse(res, null, err);
    }
    return helper.sendResponse(res, result, null);

}