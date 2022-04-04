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
let logger = chainUtil.getLogger('ProductStyle-API');
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

exports.recordProductProfile = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');
    try {
        req
            .checkBody("name")
            .notEmpty()
            .withMessage("Field cannot be empty")
            .trim();
        req
            .checkBody("styleID")
            .notEmpty()
            .withMessage("Style ID cannot be empty")
            .trim();

        req
            .checkBody("size")
            .notEmpty()
            .withMessage("Field cannot be empty")
            .trim();
        req
            .checkBody("weight")
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


    //let styleID = req.body.brandID + "STYLE" + randomize('0', 4)

    let productProfileJSON = {
        styleID: req.body.styleID,
        name: req.body.name,
        size: req.body.size,
        weight: req.body.weight,
        brandID: req.body.brandID,
        description: req.body.description,
        imageIDs: []
    }

    let imageJSON = {};
    let jsonArr = [];
    let method = "recordProductStyle";

    logger.info('called chaincode for method : ', method);
    productProfileJSON.ObjectType = "ProductStyle"

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

        productProfileJSON.imageIDs.push(imageID)
    }

    jsonArr.push(JSON.stringify(productProfileJSON));
    jsonArr.push(JSON.stringify(imageJSON));

    let result;
    try {
        result = await chainUtil.invokeTransaction(config.channelName, config.chaincodeName, jsonArr, method, req.decoded.email, req.decoded.orgName, "");
    } catch (err) {
        return helper.sendResponse(res, null, err);
    }
    return helper.sendResponse(res, result, null);

}


exports.updateProductProfile = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = req.body;
    let method = "updateProductProfile";

    logger.info('called chaincode for method : ', method);

    let productProfileJSON = {
        styleID: req.body.styleID,
        imageIDs: []
    }
    productProfileJSON.ObjectType = "ProductStyle";

    let imageJSON = {};
    let jsonArr = [];

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

        productProfileJSON.imageIDs.push(imageID)
    }

    jsonArr.push(JSON.stringify(productProfileJSON));
    jsonArr.push(JSON.stringify(imageJSON));

    let result;
    try {
        result = await chainUtil.invokeTransaction(config.channelName, config.chaincodeName, jsonArr, method, req.decoded.email, req.decoded.orgName, "");
    } catch (err) {
        return helper.sendResponse(res, null, err);
    }
    return helper.sendResponse(res, result, null);
}

exports.queryProductProfile = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryProductProfile";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "ProductStyle"
    argsJSON.StyleID = req.params.StyleID

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

exports.queryProductProfilebyBrand = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryProductProfilebyBrand";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "ProductStyle"
    argsJSON.brandID = req.params.brandid

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


exports.queryProductProfileHistory = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryProductProfileHistory";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "ProductStyle"
    argsJSON.StyleID = req.params.StyleID

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

exports.queryProductProfileList = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryProductProfileList";
    let resultPromise;

    logger.info('called chaincode for method : ', method);
    argsJSON.ObjectType = "ProductStyle";

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

exports.deleteProductProfile = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "deleteProductProfile";
    let resultPromise;

    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "ProductStyle";
    argsJSON.StyleID = req.params.StyleID

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