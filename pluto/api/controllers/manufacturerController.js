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
let logger = chainUtil.getLogger('Manufacturer-API');
let config = require('config');
let helper = require('../helpers/helper.js');
const OrderedUUID = require("ordered-uuid");

exports.recordManufacturer = async function(req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {
        manufacturerID: req.body.manufacturerID,
        name: req.body.name,
        location: req.body.location,
        factoryIDs: req.body.factoryIDs,
        brandIDs: req.body.brandIDs
    }

    let method = "recordManufacturer";

    logger.info('called chaincode for method : ', method);
    argsJSON.ObjectType = "Manufacturer"

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

exports.updateManufacturer = async function(req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = req.body;
    let method = "updateManufacturer";

    logger.info('called chaincode for method : ', method);
    argsJSON.ObjectType = "Manufacturer";

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

exports.queryManufacturer = async function(req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryManufacturer";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Manufacturer"
    argsJSON.ManufacturerID = res.locals.decoded._id

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

exports.queryManufacturerHistory = async function(req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryManufacturerHistory";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Manufacturer"
    argsJSON.ManufacturerID = req.params.ManufacturerID

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

exports.queryManufacturerList = async function(req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryManufacturerList";
    let resultPromise;

    logger.info('called chaincode for method : ', method);
    argsJSON.ObjectType = "Manufacturer";

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

exports.deleteManufacturer = async function(req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "deleteManufacturer";
    let resultPromise;

    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Manufacturer";
    argsJSON.ManufacturerID = req.params.ManufacturerID

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