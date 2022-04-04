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

const eventHelper = {};
const helper = require('./fabric-helper');
const itemController = require("../controllers/itemCtrl");
const config = require('config');
const moment = require('moment');
const logger = helper.getLogger('event-helper');

eventHelper.registerEvent = async function (sendAll) {
    let registrar = await helper.getRegistrarForOrg(config.auctionHouseOrgName);

    let client = await helper.getClientForOrg(config.auctionHouseOrgName);
    await client.setUserContext({ username: registrar.enrollId, password: registrar.enrollSecret });

    let eventHubs = await helper.getEventHubsForOrg(config.auctionHouseOrgName);
    let eventHub = eventHubs[0];
    if (!eventHub.isconnected()) {
        eventHub.connect();
    }

    eventHub.registerChaincodeEvent(config.chaincodeName, 'TRANSFER_ITEM', function (data) {
        let item = JSON.parse(data.payload.toString('utf8'));
        itemController.transferItemEvent(item, registrar.enrollId, config.auctionHouseOrgName);
    }, function (err) {
        logger.error(err.message);
    }, { unregister: false, disconnect: false });

    eventHub.registerBlockEvent(
        (block) => {
            //logger.info(JSON.stringify(block));
            let response = {
                block_id: block.header.number,
                txs: []
            };

            try {
                let tx = '';
                // -- move though the block data! -- //
                for (let i in block.data.data) {				//iter through transactions
                    try {
                        tx = {
                            tx_id: block.data.data[i].payload.header.channel_header.tx_id,
                            timestamp: moment(Date.parse(block.data.data[i].payload.header.channel_header.timestamp)).format(config.dateFormat),
                            creator_msp_id: block.data.data[i].payload.header.signature_header.creator.Mspid,
                        };
                    }
                    catch (e) {
                        logger.warn('error in removing buffers - this does not matter', e);
                    }
                    // -- parse for parameters -- //
                    response.txs.push(tx);
                }
            }
            catch (e) {
                logger.warn('error in parsing data - this may matter', e);
            }
            logger.info(response);
            sendAll(response);
        },
        (err) => {
            logger.info(err);
        }
    );
}

module.exports = eventHelper;