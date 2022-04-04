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
const channelLib = require('../../lib/join-channel.js')

exports.command = 'join';
exports.desc = 'Join Channel';
exports.builder = function (yargs) {
    return yargs.option('channel-name', {
        demandOption: true,
        describe: 'Name for the channel to join',
        requiresArg: true,
        type: 'string'
    });
};

exports.handler = function (argv) {
    return channelLib.joinChannel(argv['channel-name'], argv['org']);
};