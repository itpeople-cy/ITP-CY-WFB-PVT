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
const instantiateLib = require('../../lib/instantiate-chaincode.js')

exports.command = 'instantiate';
exports.desc = 'Instantiate chaincode';
exports.builder = function (yargs) {
    return yargs.option('cc-name', {
        demandOption: true,
        describe: 'Name for the chaincode to instantiate',
        requiresArg: true,
        type: 'string'
    }).option('cc-version', {
        demandOption: true,
        describe: 'The version of chaincode to instantiate',
        requiresArg: true,
        type: 'string'
    }).option('channel', {
        demandOption: true,
        describe: 'Name of the channel to instantiate chaincode',
        requiresArg: true,
        type: 'string'
    }).option('init-arg', {
        array: true,
        demandOption: false,
        describe: 'Value(s) to pass as argument to instantiation call.',
        requiresArg: true,
        type: 'string'
    }).option('upgrade', {
        demandOption: false,
        describe: 'Specify \'true\' if instantiating new version of existing chaincode.',
        requiresArg: false,
        type: 'boolean'
    });
};

exports.handler = function (argv) {
    let upgrade = false;
    if (argv['upgrade'] !== undefined) {
        upgrade = argv.upgrade;
    }

    return instantiateLib.instantiateChaincode(argv['channel'], argv['cc-name'], argv['cc-version'], argv['init-arg'], argv['org'], upgrade);
};