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
let logger = chainUtil.getLogger('ProductProfileSignature-API');
let config = require('config');
let helper = require('../helpers/helper.js');
const OrderedUUID = require("ordered-uuid");

exports.recordProductProfileSignature = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let productProfileID = OrderedUUID.generate();

    let argsJSON = {
        productProfileID: productProfileID,
        signatureDocument: req.body.signatureDocument
    }

    let method = "recordProductProfileSignature";

    logger.info('called chaincode for method : ', method);
    argsJSON.ObjectType = "ProductProfileSignature"

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

exports.updateProductProfileSignature = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = req.body;
    let method = "updateProductProfileSignature";

    logger.info('called chaincode for method : ', method);
    argsJSON.ObjectType = "ProductProfileSignature";

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

exports.queryProductProfileSignature = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryProductProfileSignature";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "ProductProfileSignature"
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

exports.queryProductProfileSignatureHistory = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryProductProfileSignatureHistory";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "ProductProfileSignature"
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

exports.queryProductProfileSignatureList = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryProductProfileSignatureList";
    let resultPromise;

    logger.info('called chaincode for method : ', method);
    argsJSON.ObjectType = "ProductProfileSignature";

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

exports.deleteProductProfileSignature = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "deleteProductProfileSignature";
    let resultPromise;

    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "ProductProfileSignature";
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