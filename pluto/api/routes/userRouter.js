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

const express = require('express');
const router = express.Router();
const userContoller = require('../controllers/userContoller');
const userValidate = require('../validate/userValidate');
const config = require('config');
const helper = require('../helpers/fabric-helper');
let isAuthenticated = require('../middleware/authentication').authenticate;

router.get('/', function (req, res) { res.send("Welcome to : users routes :" + req.hostname + " REST-API"); });
//login with existing username and password to receive a jwtToken.
router.post('/login', userValidate.login, userContoller.login);
//register a new users with the org
router.post('/register', userValidate.register, userContoller.register);
// update password
router.post('/update', isAuthenticated, userValidate.updatePassword, userContoller.updatePassword);
//mandatary to export
module.exports = router;
