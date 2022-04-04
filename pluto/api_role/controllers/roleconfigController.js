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
let logger = chainUtil.getLogger('RoleConfig-API');
let config = require('config');
let helper = require('../helpers/helper.js');

exports.recordRoleConfig = async function(req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = req.body;
    let method = "recordRoleConfig";

    logger.info('called chaincode for method : ', method);
    argsJSON.ObjectType = "RoleConfig"

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

exports.updateRoleConfig = async function(req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = req.body;
    let method = "updateRoleConfig";

    logger.info('called chaincode for method : ', method);
    argsJSON.ObjectType = "RoleConfig";

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

exports.queryRoleConfig = async function(req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryRoleConfig";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "RoleConfig"
    argsJSON.ChainCodeID = req.params.ChainCodeID

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

exports.queryRoleConfigHistory = async function(req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryRoleConfigHistory";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "RoleConfig"
    argsJSON.ChainCodeID = req.params.ChainCodeID

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

exports.queryRoleConfigList = async function(req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryRoleConfigList";
    let resultPromise;

    logger.info('called chaincode for method : ', method);
    argsJSON.ObjectType = "RoleConfig";

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

exports.deleteRoleConfig = async function(req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "deleteRoleConfig";
    let resultPromise;

    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "RoleConfig";
    argsJSON.ChainCodeID = req.params.ChainCodeID

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