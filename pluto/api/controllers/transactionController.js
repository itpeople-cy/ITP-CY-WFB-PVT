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
let logger = chainUtil.getLogger('Transaction-API');
let config = require('config');
let helper = require('../helpers/helper.js');
let email = require('../services/email/email')
let fs = require('fs')
let util = require('util');
var path = require('path')
let unlink = util.promisify(fs.unlink)
let writeFile = util.promisify(fs.writeFile)
let QRCode = require('qrcode');

const OrderedUUID = require("ordered-uuid");

exports.recordTransaction = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let transactionID = OrderedUUID.generate();
    let date = new Date();

    let registration = {
        transactionID: transactionID,
        emailID: req.body.email,
        username: req.body.username,
        address: req.body.address,
        certificatehash: ""

    }
    let transactionJSON = {
        transactionID: transactionID,
        retailerID: res.locals.decoded._id,
        productID: req.body.productID,
        location: req.body.location,
        date: date,
        registration: registration
    }
    let tagJSON = {
        tagID: req.body.tagID
    }


    let method = "recordTransaction";

    logger.info('called chaincode for method : ', method);
    transactionJSON.ObjectType = "Transaction"

    let jsonArr = [];
    jsonArr.push(JSON.stringify(transactionJSON));
    jsonArr.push(JSON.stringify(tagJSON));
    let result;

    try {
        result = await chainUtil.invokeTransaction(config.channelName, config.chaincodeName, jsonArr, method, req.decoded.email, req.decoded.orgName, "");
        if (JSON.parse(result).objectBytes != null) {
            data = JSON.parse(JSON.parse(result).objectBytes)
            let certificateHash = data.registration.certificateHash
            let userEmail = data.registration.emailID
            let imagePath = path.join(__dirname, "./../services/email/", "qr.png")
            await qrCodeGenerator(imagePath, certificateHash)
            await email.sendCertificateHash(userEmail, "qr.png")
            await unlink(imagePath)
        }
        else {
            return helper.sendResponse(res, null, err);
        }

    } catch (err) {
        return helper.sendResponse(res, null, err);
    }
    return helper.sendResponse(res, result, null);

}

exports.updateTransaction = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = req.body;
    let method = "updateTransaction";

    logger.info('called chaincode for method : ', method);
    argsJSON.ObjectType = "Transaction";

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

exports.queryTransaction = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryTransaction";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Transaction"
    argsJSON.TransactionID = req.params.TransactionID

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

exports.queryTransactionHistory = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryTransactionHistory";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Transaction"
    argsJSON.TransactionID = req.params.TransactionID

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

exports.queryTransactionList = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryTransactionList";
    let resultPromise;

    logger.info('called chaincode for method : ', method);
    argsJSON.ObjectType = "Transaction";

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

exports.deleteTransaction = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "deleteTransaction";
    let resultPromise;

    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Transaction";
    argsJSON.TransactionID = req.params.TransactionID

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

exports.verifyCertificateHash = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "verifyCertificateHash";
    let resultPromise;

    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Transaction";
    argsJSON.productID = req.body.productID;

    let registration = {
        emailID: req.body.email,
        certificatehash: req.body.hash
    }
    argsJSON.registration = registration;
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

function qrCodeGenerator(imagePath, hash) {
    try {
        QRCode.toFile(imagePath, hash, function (err) {
            if (err) throw err
        })
    } catch (err) {
        return err
    }
}