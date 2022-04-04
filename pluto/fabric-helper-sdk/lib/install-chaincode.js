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
const util = require('util');
const helper = require('./helper.js');
const logger = helper.getLogger('install-chaincode');

var installChaincode = async function (channelName, chaincodeName, chaincodePath,
	chaincodeVersion, orgName) {
	logger.debug('\n============ Install chaincode on organizations ============\n');

	let all_good = false;
	let error_message = null;
	// if ( chaincodeName == "projectkicker_role") {
	// 	helper.setupRoleChaincodeDeploy(chaincodePath);
	// }
	// else {
		var response = await helper.setupChaincodeDeploy(chaincodePath);
	//}
	

	try {
		logger.info('Calling peers in organization "%s" to join the channel', orgName);

		// first setup the client for this orgName
		var client = await helper.getAdminClientForOrg(orgName);
		logger.debug('Successfully got the fabric client for the organization "%s"', orgName);

		var request = {
			targets: client.getPeersForOrg(client.getMspid()),
			chaincodePath: chaincodePath,
			chaincodeId: chaincodeName,
			chaincodeVersion: chaincodeVersion
		};
		let results = await client.installChaincode(request);
		all_good = helper.inspectProposalResult(results);
	} catch (error) {
		logger.error('Failed to install due to error: ' + error.stack ? error.stack : error);
		error_message = 'Failed to install due to error: ' + error.stack ? error.stack : error;
		all_good = false;
	}

	if (all_good) {
		let message = util.format('Successfully installed chaincode');
		logger.info(message);
		let response = {
			success: true,
			message: message
		};
		return response;
	} else {
		let message = util.format('Failed to install chaincode due to:%s', error_message);
		logger.error(message);
		throw new Error(message);
	}
};

exports.installChaincode = installChaincode;
