
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

const appUtil = {};
const config = require('config');
const crypto = require('crypto');
const helper = require('./fabric-helper');
const logger = helper.getLogger('util');
const bcrypt = require('bcrypt');
const SALT_FACTOR = 5;

appUtil.isPathUnprotected = function (text, searchWords) {
  // create a regular expression from searchwords using join and |. Add "gi".
  // Example: ["ANY", "UNATTENDED","HELLO"] becomes
  // "ANY|UNATTENDED|HELLO","gi"
  // | means OR. gi means GLOBALLY and CASEINSENSITIVE
  let searchExp = new RegExp(searchWords.join("|"), "gi");
  // regularExpression.test(string) returns true or false
  return (searchExp.test(text)) ? true : false;
}

appUtil.encrypt = function (text, masterkey) {
  // random initialization vector
  const iv = crypto.randomBytes(16);

  // random salt
  const salt = crypto.randomBytes(64);

  // derive key: 32 byte key length - in assumption the masterkey is a cryptographic and NOT a password there is no need for
  // a large number of iterations. It may can replaced by HKDF
  const key = crypto.pbkdf2Sync(masterkey, salt, 2145, 32, 'sha512');

  // AES 256 GCM Mode
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  // encrypt the given text
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

  // extract the auth tag
  const tag = cipher.getAuthTag();

  // generate output
  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
},

  /**
  * Decrypts text by given key
  * @param String base64 encoded input data
  * @param Buffer masterkey
  * @returns String decrypted (original) text
  */
  appUtil.decrypt = function (data, masterkey) {
    // base64 decoding
    const bData = new Buffer(data, 'base64');

    // convert data to buffers
    const salt = bData.slice(0, 64);
    const iv = bData.slice(64, 80);
    const tag = bData.slice(80, 96);
    const text = bData.slice(96);

    // derive key using; 32 byte key length
    const key = crypto.pbkdf2Sync(masterkey, salt, 2145, 32, 'sha512');

    // AES 256 GCM Mode
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);

    // encrypt the given text
    const decrypted = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');

    return decrypted;
  }

appUtil.hash = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
      if (err) return reject(err);
      bcrypt.hash(password, salt, (err, data) => err ? reject(err) : resolve(data));
    });
  });
}

appUtil.isHashEqual = function (password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, isEqual) {
      if (err) return reject(err);

      if (isEqual) {
        resolve(null);
      } else {
        reject("Invalid Credentials");
      }
    });
  });
}

//mandatary to export
module.exports = appUtil;
