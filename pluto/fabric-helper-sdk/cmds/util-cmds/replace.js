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
const utilLib = require('../../lib/utils.js')

exports.command = 'replace';
exports.desc = 'Replace Certificate Data';
exports.builder = function (yargs) {
    return yargs.option('file-name', {
        demandOption: true,
        describe: 'File Name',
        requiresArg: true,
        type: 'string'
    }).option('cert-name', {
        demandOption: true,
        describe: 'Certificate Name',
        requiresArg: true,
        type: 'string'
    }).option('cert-value', {
        demandOption: true,
        describe: 'Certificate Value',
        requiresArg: true,
        type: 'string'
    })
};

exports.handler = function (argv) {
    return utilLib.replaceCryptoData(argv['file-name'], argv['cert-name'], argv['cert-value']);
};