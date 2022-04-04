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
const fs = require('fs');
const path = require('path');

function fileExists(filename) {
  try {
    fs.accessSync(filename, fs.R_OK);
    return true;
  } catch (e) {
    return false;
  }
}

function replaceCryptoData(filename, certName, certValue) {
  let data = fs.readFileSync(path.join(__dirname, filename));
  let result = data.toString().replace(certName, certValue.slice(1, -1));
  fs.writeFileSync(path.join(__dirname, filename), result);
}

exports.replaceCryptoData = replaceCryptoData;
exports.fileExists = fileExists;