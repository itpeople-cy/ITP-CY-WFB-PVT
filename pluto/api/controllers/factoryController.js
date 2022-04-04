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
let logger = chainUtil.getLogger('Brand-API');
let config = require('config');
let helper = require('../helpers/helper.js');
const OrderedUUID = require("ordered-uuid");
const shortid = require('shortid');

exports.recordFactory = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {
        factoryID: req.body.factoryID,
        location: req.body.location,
        brandIDs: req.body.brandIDs
    }

    let method = "recordFactory";

    logger.info('called chaincode for method : ', method);
    argsJSON.ObjectType = "Factory"

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


exports.queryFactory = async function(req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = {};
    let method = "queryFactory";
    logger.info('called chaincode for method : ', method);

    argsJSON.ObjectType = "Factory"
     if (req.query.brandid){
        argsJSON.brandID = req.query.brandid
        method = "queryFactorybyBrand";
     }
     else {
        argsJSON.factoryID = res.locals.decoded._id
       method = "queryFactory";
     }

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