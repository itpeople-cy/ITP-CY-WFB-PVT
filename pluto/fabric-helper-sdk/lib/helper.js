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
const path = require('path');
const util = require('util');
const fs = require('fs-extra');
const User = require('fabric-client/lib/User.js');
const hfc = require('fabric-client');
const log4js = require('log4js');
const utils = require('fabric-client/lib/utils.js');
const logger = log4js.getLogger('fabric-helper');



//Setting default environment type if not mentioned to local
if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = 'local'
}

hfc.addConfigFile(path.join(__dirname, '../../network/general-config.json'));
hfc.setLogger(logger);
logger.setLevel(hfc.getConfigSetting('loglevel'));


let clients = {};
let evenHubs = {};

module.exports.getClientForOrg = async function (org) {
	if (clients[org] == undefined) {
		//Set configuration files for Org
		hfc.setConfigSetting('request-timeout', hfc.getConfigSetting('eventWaitTime'));
		hfc.setConfigSetting(org + '-network', path.join(__dirname, '../../network/' + process.env.NODE_ENV + '/network-config/network-config-' + org + '.json'));
		hfc.setConfigSetting(org, path.join(__dirname, '../../network/' + process.env.NODE_ENV + '/network-config/' + org + '.json'));

		//Get Client for Org
		var client = hfc.loadFromConfig(hfc.getConfigSetting(org + '-network'));
		client.loadFromConfig(hfc.getConfigSetting(org));
		client.network = require(path.join(__dirname, '../../network/' + process.env.NODE_ENV + '/network-config/network-config-' + org + '.json'));
		//Intitalize Key Value Store
		//await client.initCredentialStores();

		// External DB KeyStore Implementation
		let clientConfig = client.getClientConfig();
		utils.setConfigSetting('crypto-keysize', clientConfig['crypto-keysize']);
		utils.setConfigSetting('key-value-store', path.join(__dirname, clientConfig['key-value-store-impl']));

		let options = { name: clientConfig['key-value-store-name'], url: clientConfig['key-value-store-db'] };
		let kvs = await utils.newKeyValueStore(options);

		let cryptoSuite = hfc.newCryptoSuite();
		cryptoSuite.setCryptoKeyStore(hfc.newCryptoKeyStore(options));
		client.setCryptoSuite(cryptoSuite);
		client.setStateStore(kvs);

		clients[org] = client;
		evenHubs[org] = client.getEventHubsForOrg(org);
		return client;
	}
	else {
		return clients[org];
	}
};

module.exports.getEventHubsForOrg = function (userOrg) {
	return evenHubs[userOrg];
}

module.exports.getRegistrarForOrg = async function (userOrg) {
	let client = await this.getClientForOrg(userOrg);
	let certificateAuthority = client.network.organizations[userOrg].certificateAuthorities[0];

	return client.network.certificateAuthorities[certificateAuthority].registrar[0];
}

module.exports.getRegisteredUser = async function (username, userOrg) {
	try {
		var client = await this.getClientForOrg(userOrg);
		let user = await client.getUserContext(username, true);

		if (user && user.isEnrolled()) {
			logger.info('Successfully loaded "%s" of org "%s" from persistence', username, userOrg);
			return user;
		}
		else {
			throw new Error('username or password incorrect');
		}
	} catch (err) {
		logger.error('Failed to get Registered User: ' + err.stack ? err.stack : err);
		throw new Error('Failed to get Registered User: ' + err.toString());
	}
};

module.exports.getAdminUser = async function (userOrg) {
	try {
		let client = await this.getClientForOrg(userOrg);
		let registrar = await this.getRegistrarForOrg(userOrg);
		let user = await client.getUserContext(registrar.enrollId, true);

		if (user && user.isEnrolled()) {
			logger.info('Successfully loaded "%s" of org "%s" from persistence', registrar.enrollId, userOrg);
			return user;
		}
		else {
			let admin = await client.setUserContext({ username: registrar.enrollId, password: registrar.enrollSecret });
			user = await client.getUserContext(registrar.enrollId, true);

			if (user && user.isEnrolled()) {
				logger.info('Successfully loaded "%s" of org "%s" from persistence', registrar.enrollId, userOrg);
				return user;
			}
			else {
				throw new Error('username or password incorrect');
			}
		}
	} catch (err) {
		logger.error('Failed to get Registered User: ' + err.stack ? err.stack : err);
		throw new Error('Failed to get Registered User: ' + err.toString());
	}
};

module.exports.registerUser = async function (username, secret, userOrg, role, isJson) {
	try {
		let client = await this.getClientForOrg(userOrg);
		let message = null;

		logger.info('User "%s" was not enrolled, so we will need an admin user object to register', username);
		let registrar = await this.getRegistrarForOrg(userOrg);
		let adminUserObj = await client.setUserContext({ username: registrar.enrollId, password: registrar.enrollSecret });
		let caClient = client.getCertificateAuthority();

		// TODO: Temporary fix till Starter Plan gets changed
		let affiliation = null;
		if (process.env.NODE_ENV == 'production') {
			affiliation = 'org1.department1'
		} else {
			affiliation = userOrg.toLowerCase() + '.department1'
		}

		try {
			await caClient.register({
				enrollmentID: username,
				enrollmentSecret: secret,
				affiliation: affiliation,
				attrs: [{
					name: "role",
					value: role,
					ecert: true
				}]
			}, adminUserObj);
		}
		catch (error) {
			logger.error('Failed to get registered user: "%s" with error: "%s"', username, error.toString());
			throw new Error(error.toString());
		}

		logger.info('Successfully got the secret for user "%s"', username);

		try {
			message = await caClient.enroll({
				enrollmentID: username,
				enrollmentSecret: secret,
				role: role,
				attr_reqs: [{
					name: "role",
					require: true
				}]
			});
		}
		catch (error) {
			logger.error('Failed to get enroll user: "%s" with error: "%s"', username, error.toString());
			throw new Error(error.toString());
		}

		logger.info(username + ' enrolled successfully on ' + userOrg);

		let member = new User(username);
		member.setCryptoSuite(client.getCryptoSuite());
		message = await member.setEnrollment(message.key, message.certificate,
			client.getMspid(userOrg));

		if (member === null)
			throw new Error(message);

		await client.setUserContext(member);
		if (member && member.isEnrolled) {
			if (isJson && isJson === true) {
				var response = {
					success: true,
					email: username,
					password: secret
				};
				return response;
			}
		} else {
			throw new Error('User was not enrolled ');
		}
	} catch (error) {
		logger.error('Failed to get registered user: "%s" with error: "%s"', username, error.toString());
		throw new Error(error.toString());
	}
}

module.exports.updatePassword = async function (username, secret, userOrg, isJson) {
	try {
		let client = await this.getClientForOrg(userOrg);

		let registrar = await this.getRegistrarForOrg(userOrg);
		let adminUserObj = await client.setUserContext({ username: registrar.enrollId, password: registrar.enrollSecret });
		let caClient = client.getCertificateAuthority();

		try {
			let identityService = caClient.newIdentityService();
			identityService.update(username, {
				enrollmentSecret: secret
			}, adminUserObj);
		}
		catch (error) {
			logger.error('Failed to get update password for user: "%s" with error: "%s"', username, error.toString());
			throw new Error(error.toString());
		}

		if (isJson && isJson === true) {
			var response = {
				success: true,
				email: username,
				password: secret
			};
			return response;
		}
	} catch (error) {
		logger.error('Failed to update password for user: "%s" with error: "%s"', username, error.toString());
		throw new Error(error.toString());
	}
}

// TODO: Temporary fix till Fabric SDK gets Fixed.  Remove this method and use getClientForOrg instead
module.exports.getAdminClientForOrg = async function (userOrg) {
	var client = await this.getClientForOrg(userOrg);

	let privateKeyPEM = null;
	let signedCertPEM = null;
	let orgAdmin = client._network_config._network_config.organizations[client.getClientConfig().organization];

	if (orgAdmin.adminPrivateKey.pem) {
		privateKeyPEM = orgAdmin.adminPrivateKey.pem
	}
	else {
		privateKeyPEM = fs.readFileSync(path.join(__dirname, '../', orgAdmin.adminPrivateKey.path));
	}

	if (orgAdmin.signedCert.pem) {
		signedCertPEM = orgAdmin.signedCert.pem
	}
	else {
		signedCertPEM = fs.readFileSync(path.join(__dirname, '../', orgAdmin.signedCert.path));
	}

	await client.createUser({
		username: 'peer' + userOrg + 'Admin',
		mspid: client.getMspid(),
		cryptoContent: {
			privateKeyPEM: privateKeyPEM,
			signedCertPEM: signedCertPEM
		}
	});

	return client;
};

module.exports.setupChaincodeDeploy = async function (chaincodePath) {
	logger.info('chaincodePath' + path.join(__dirname, hfc.getConfigSetting('chaincodePath')));
	process.env.GOPATH = path.join(__dirname, hfc.getConfigSetting('chaincodePath'));
};

// module.exports.setupRoleChaincodeDeploy = function () {
// 	logger.info('chaincodeRolePath' + path.join(__dirname, hfc.getConfigSetting('chaincodeRolePath')));
// 	process.env.GOPATH = path.join(__dirname, hfc.getConfigSetting('chaincodeRolePath'));
// };

module.exports.inspectProposalResult = function (proposalResult) {
	let proposalResponses = proposalResult[0];
	let proposal = proposalResult[1];
	let all_good = true;
	for (var i in proposalResponses) {
		let one_good = false;
		if (proposalResponses && proposalResponses[i].response &&
			proposalResponses[i].response.status === 200) {
			one_good = true;
			logger.info('Proposal was good');
		} else {
			logger.error('Proposal was bad');
		}
		all_good = all_good & one_good;
	}
	if (all_good) {
		logger.info(util.format(
			'Successfully sent Proposal and received ProposalResponse: Status - "%s", message - ""%s""',
			proposalResponses[0].response.status, proposalResponses[0].response.message));
	} else {
		throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200.');
	}

	return all_good;
}

/*module.exports.getTargetPeers = function (colletionName) {
	try {
		if (colletionName == "")
			return null;
		
		let collectionsConfig = require("../../projectkicker/chaincode/src/projectkicker/privateCollections.json");
		let targetPeers = [];
		for (let i=0;i<collectionsConfig.length;i++) {
			if (collectionsConfig[i].name == colletionName) {
				mspIdenties = collectionsConfig[i].policy.identities;

				for (let j=0;i<mspIdenties.length;j++) {
					targetPeers.push(client.getPeersForOrg(mspIdenties[j].role.mspId));
				}
			}
		}

	}catch(err) {
		logger.error('Error in Fabric lib helper in getTargetPeers(): "%s"',err);
		return null;
	}

	return targetPeers;

}*/


module.exports.getTargetPeers = function (colletionName,channel) {
	let targetPeers = [];
	let channelPeers = channel.getPeers();
	try {
		if (colletionName == "")
			return null;
		
		const collectionsConfigFile = path.resolve(__dirname, "../../network/privateCollections.json");
		let collectionsConfig = JSON.parse(fs.readFileSync(collectionsConfigFile)); 

		
		for (let i=0;i<collectionsConfig.length;i++) {
			if (collectionsConfig[i].name == colletionName) {
				console.log(collectionsConfig[i]);
				console.log(collectionsConfig[i].policy);
				let mspIdenties = collectionsConfig[i].policy.identities;

				for (let j=0;j<mspIdenties.length;j++) {
					console.log("targetPeers",j);

					channelPeers.forEach(function(peer) {
						console.log("Channel Peer:",peer);
						if (peer._mspid == mspIdenties[j].role.mspId)
							targetPeers.push(peer._name);	
					});
					
					console.log("targetPeers:",targetPeers);
				}
			}
		}

	}catch(err) {
		logger.error('Error in Fabric lib helper in getTargetPeers(): "%s"',err);
		return null;
	}

	return targetPeers;

}

module.exports.getLogger = function (moduleName) {
	var logger = log4js.getLogger(moduleName);
	logger.setLevel(hfc.getConfigSetting('loglevel'));
	return logger;
};
