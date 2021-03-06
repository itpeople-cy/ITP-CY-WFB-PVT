
/**
 * Copyright 2018 IT People Corporation. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
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
const fs = require('fs');
const path = require('path');
const config = require('../../network/general-config.json');
const helper = require('./helper.js');
const logger = helper.getLogger('Update-Channel');

var updateChannel = async function (channelName, orgName, pathName) {
	logger.debug('\n====== Updating Channel \'' + channelName + '\' ======\n');
	try {
		let client = await helper.getAdminClientForOrg(orgName);
		logger.debug('Successfully got the fabric client for the organization "%s"', orgName);

		// read in the envelope for the channel config raw bytes
		let envelope = fs.readFileSync(path.join(__dirname, config.anchorPeerOrgPath, pathName));
		// extract the channel config bytes from the envelope to be signed
		let channelConfig = client.extractChannelConfig(envelope);

		//Acting as a client in the given organization provided with "orgName" param
		// sign the channel config bytes as "endorsement", this is required by
		// the orderer's channel creation policy
		// this will use the admin identity assigned to the client when the connection profile was loaded
		let signature = client.signChannelConfig(channelConfig);

		let request = {
			config: channelConfig,
			signatures: [signature],
			name: channelName,
			txId: client.newTransactionID(true) // get an admin based transactionID
		};

		// send to orderer
		let response = await client.updateChannel(request)
		logger.debug(' response ::%j', response);
		if (response && response.status === 'SUCCESS') {
			logger.info('Successfully updated the channel.');
			let response = {
				success: true,
				message: 'Channel \'' + channelName + '\' updated Successfully'
			};
			return response;
		} else {
			logger.error('\nFailed to update the channel \'' + channelName +
				'\'\n\n');
			throw new Error('Failed to update the channel \'' + channelName + '\'');
		}
	} catch (err) {
		logger.error('Failed to initialize the channel: ' + err.stack ? err.stack : err);
		throw new Error('Failed to initialize the channel: ' + err.toString());
	}
};


exports.updateChannel = updateChannel;
