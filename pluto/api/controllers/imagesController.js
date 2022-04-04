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
let logger = chainUtil.getLogger('Images-API');
let config = require('config');
let helper = require('../helpers/helper.js');
let multer = require('multer')
let mkdirp = require("mkdirp");
let path = require('path')
let shell = require('shelljs')
let fs = require('fs')
let util = require('util');
let unlink = util.promisify(fs.unlink)
const OrderedUUID = require("ordered-uuid");

exports.recordImages = async function(req, res) {
    let result
    try {
        logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
        res.set('Content-Type', 'application/json');
        
        let argsJSON = {};
        let method = "recordImages";

        let fileData = await exports.uploadAsyncuploadAsync(req, res)
        argsJSON.imageID = OrderedUUID.generate()
        argsJSON.imageName = fileData.filename
        argsJSON.imageType = fileData.mimetype
        argsJSON.imagePath = "/usr/local/bin/" + argsJSON.imageName

        logger.info('called chaincode for method : ', method);
        argsJSON.ObjectType = "Images"
        
        let jsonArr = [];
        jsonArr.push(JSON.stringify(argsJSON));

        shell.exec('./../network/local/addImageToContainer.sh ' + argsJSON.imageName)

        result = await chainUtil.invokeTransaction(config.channelName, config.chaincodeName, jsonArr,
            method, req.decoded.email, req.decoded.orgName, "");

            let imagePath = path.join('./uploads', argsJSON.imageName)
        await unlink(imagePath)
    } catch (err) {
        return helper.sendResponse(res, null, err);
    }
    return helper.sendResponse(res, result, null);
    
}

exports.updateImages = async function(req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = req.body;
    let method = "updateImages";

    logger.info('called chaincode for method : ', method);
    argsJSON.ObjectType = "Images";

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

exports.queryImages = async function(req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryImages";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Images"
    argsJSON.ImageID = req.params.ImageID

    let jsonArr = [];
    jsonArr.push(JSON.stringify(argsJSON));

    let result
    try {
        result = await chainUtil.queryChaincode(config.channelName, config.chaincodeName, jsonArr, method, req.decoded.email, req.decoded.orgName);
    } catch (err) {
        return helper.sendResponse(res, null, err);
    }
    return helper.sendResponse(res, result, null);
}

exports.queryImagesHistory = async function(req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryImagesHistory";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Images"
    argsJSON.ImageID = req.params.ImageID

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

exports.queryImagesList = async function(req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = req.body;
    let method

    if (req.body.productID) {
        method = "queryProduct"
        argsJSON.ObjectType = "Product"
    } else {
        method = "queryProductProfile"
        argsJSON.ObjectType = "ProductStyle"
    }

    logger.info('called chaincode for method : ', method);

    let jsonArr = [];
    jsonArr.push(JSON.stringify(argsJSON));

    let result;
    try {
        result = await chainUtil.queryChaincode(config.channelName, config.chaincodeName, jsonArr, method, req.decoded.email, req.decoded.orgName);

        if (result.includes('SUCCESS')) {
            result = { "encodedImages": JSON.parse(JSON.parse(result).objectBytes).endodedImages }
        }

    } catch (err) {
        return helper.sendResponse(res, null, err);
    }
    return helper.sendResponse(res, result, null);
}


exports.deleteImages = async function(req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "deleteImages";
    let resultPromise;

    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Images";
    argsJSON.ImageID = req.params.ImageID

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

exports.uploadAsync = function(req, res) {
    return new Promise(function (resolve, reject) {
        upload(req, res, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(req.file);
            }
        });
    });
}

let Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        let fWD = path.join(__dirname, "../uploads");
        mkdirp(fWD);
        helper.setBasedir(fWD);
        callback(null, helper.getBasedir());
    },
    filename: function (req, file, callback) {
        let fileContent = file.originalname.split('.')
        const fileExtension = fileContent[fileContent.length - 1]
        fileContent.pop()
        file.originalname = fileContent.toString() + /* "_" + Date.now() + */"." + fileExtension
        callback(null, file.originalname)
    }
});

let upload = multer({
    storage: Storage
}).single("image");