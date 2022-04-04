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
 * Author: Sandeep Pulluru <sandeep.pulluru@itpeoplecorp.com>
 */
'use strict';
const config = require('config');
const log4js = require('log4js');
const helper = require('../../fabric-helper-sdk/lib/helper');
const invoke = require('../../fabric-helper-sdk/lib/invoke-transaction');
const query = require('../../fabric-helper-sdk/lib/query');

module.exports.getRegisteredUser = async function (username, userOrg) {
    let user = await helper.getRegisteredUser(username, userOrg);
    return user;
};

module.exports.getAdminUser = async function (userOrg) {
    let user = await helper.getAdminUser(userOrg);
    return user;
};

module.exports.getClientForOrg = async function (userOrg) {
    let client = await helper.getClientForOrg(userOrg);
    return client;
};

module.exports.getRegistrarForOrg = async function (userOrg) {
    let registrar = await helper.getRegistrarForOrg(userOrg);
    return registrar;
}

module.exports.invokeTransaction = function (channelName, chaincodeName, payloadArr, fName, username, userOrg,collectionName) {
    return invoke.invokeTransaction(channelName, chaincodeName, payloadArr, fName, username, userOrg,collectionName);
};

module.exports.queryChaincode = function (channelName, chaincodeName, payloadArr, fName, username, userOrg) {
    return query.queryChaincode(channelName, chaincodeName, payloadArr, fName, username, userOrg);
};

module.exports.registerUser = async function (username, secret, userOrg, role, isJson) {
    let user = await helper.registerUser(username, secret, userOrg, role, isJson);
    return user;
}

module.exports.updatePassword = async function (username, secret, userOrg, isJson) {
    let user = await helper.updatePassword(username, secret, userOrg, isJson);
    return user;
}

module.exports.getEventHubsForOrg = async function (userOrg) {
    let evenHub = await helper.getEventHubsForOrg(userOrg);
    return evenHub;
};

module.exports.createChannel = async function (channelName, userOrg) {
    return await createChannel(channelName, userOrg);
}

module.exports.joinChannel = async function (channelName, userOrg) {
    return await joinChannel(channelName, userOrg);
}

module.exports.sendResponse = function (res, resultPromise) {
    if (resultPromise) {
        resultPromise.then((data) => {
            res.status(200).send(data);
        }, (err) => {
            res.status(500).send(err.message);
        });
    }
}

module.exports.getLogger = function (moduleName) {
    var logger = log4js.getLogger(moduleName);
    logger.setLevel(config.logLevel);
    return logger;
};
