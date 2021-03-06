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
const installLib = require('../../lib/install-chaincode.js')

exports.command = 'install';
exports.desc = 'Install chaincode';
exports.builder = function (yargs) {
    return yargs.option('cc-name', {
        demandOption: true,
        describe: 'Name for the chaincode to install',
        requiresArg: true,
        type: 'string'
    }).option('cc-version', {
        demandOption: true,
        describe: 'The version that will be assigned to the chaincode to install',
        requiresArg: true,
        type: 'string'
    }).option('channel', {
        demandOption: true,
        describe: 'Name of the channel to install chaincode',
        requiresArg: true,
        type: 'string'
    }).option('src-dir', {
        demandOption: true,
        describe: 'Relative path where the chaincode is located with respect to GOPATH/src ',
        requiresArg: true,
        type: 'string'
    })
};

exports.handler = function (argv) {
    return installLib.installChaincode(argv['channel'], argv['cc-name'], argv['src-dir'], argv['cc-version'], argv['org']);
};