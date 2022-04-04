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
const helper = require('./helper.js');
const logger = helper.getLogger('query-chaincode');

var queryChaincode = async function (channelName, chaincodeName, args,
	functionName, userName, orgName, networkConfigFilePath) {
	logger.info('========= Query chaincode on org: "%s", channelName: "%s",' +
		'chaincodeName: "%s", userName: "%s", functionName: "%s", args: "%s" ========= '
		, orgName, channelName, chaincodeName, userName, functionName, args);

	try {
		let client = await helper.getClientForOrg(orgName);
		let user = await helper.getRegisteredUser(userName, orgName);

		let channel = client.getChannel(channelName);

		let tx_id = client.newTransactionID();

		var targetpeers = client.getPeersForOrg(client.getMspid()).map((peer) => {
			return peer._name;
		});
		let request = {
			chaincodeId: chaincodeName,
			txId: tx_id,
			fcn: functionName,
			args: args,
			targets: targetpeers
		};

		let results = await channel.queryByChaincode(request);

		if (results) {
			for (let i = 0; i < results.length; i++) {
				logger.info(results[i].toString('utf8'));
				return results[i].toString('utf8');
			}
		} else {
			logger.error('results is null');
			return 'results is null';
		}
	} catch (err) {
		logger.error('Failed query: ' + err.stack ? err.stack : err);
		throw new Error('Failed query: ' + err.toString());
	}
};

exports.queryChaincode = queryChaincode;
