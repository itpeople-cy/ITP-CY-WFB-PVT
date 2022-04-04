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
const jwt = require('jsonwebtoken');
const config = require('config');
const appUtil = require('../helpers/util');
const util = require('util');
const helper = require('../helpers/fabric-helper');
const logger = helper.getLogger('middleware-auth');

var authenticate = function (req, res, next) {
    logger.debug(util.format('Request url : - %s ', req.originalUrl));
    if (appUtil.isPathUnprotected(req.originalUrl, ['users/login'])) {
        logger.debug("indexOf unportecetd routes was found !!! ");
        return next();
    }
    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else { // if there is no token ...  return an error
        return res.status(401).send({ //instead of 403 ...
            success: false,
            message: 'No token provided.'
        });
    }
}

module.exports.authenticate = authenticate;