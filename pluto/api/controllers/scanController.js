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
let logger = chainUtil.getLogger('Scan-API');
let config = require('config');
let helper = require('../helpers/helper.js');
const OrderedUUID = require("ordered-uuid");

exports.recordScan = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let scanID = OrderedUUID.generate();
    let time = new Date();
    let argsJSON = {
        scanID:scanID,
        productID: req.body.productID,
        tagID: req.body.tagID,
        scanBy : req.body.scanBy,
        time: time,
        location: req.body.location,
        tagTechnology: req.body.tagTechnology,
        tagSupplierID: req.body.tagSupplierID
    }

    let method = "recordScan";

    logger.info('called chaincode for method : ', method);
    argsJSON.ObjectType = "Scan"

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

exports.queryScanbyID = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT CHAINCODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');

    let argsJSON = req.body;
    let method = "queryScanbyID";

    logger.info('called chaincode for method : ', method);
    argsJSON.ObjectType = "Scan";

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

