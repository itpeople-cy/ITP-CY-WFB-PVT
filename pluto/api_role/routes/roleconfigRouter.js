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
 */
'use strict';

const express = require('express');
const router = express.Router();
const verifyUserCanCall = require('../middleware/authorization');
const isAuthenticated = require('../middleware/authentication').authenticate;

let roleconfig = require('../controllers/roleconfigController');

router.post('/roleconfig', isAuthenticated, verifyUserCanCall, roleconfig.recordRoleConfig);

router.put('/roleconfig', isAuthenticated, verifyUserCanCall, roleconfig.updateRoleConfig);

router.get('/roleconfig/:ChainCodeID', isAuthenticated, verifyUserCanCall, roleconfig.queryRoleConfig);

router.get('/roleconfighistory/:ChainCodeID', isAuthenticated, verifyUserCanCall, roleconfig.queryRoleConfigHistory);

router.get('/roleconfiglist', isAuthenticated, verifyUserCanCall, roleconfig.queryRoleConfigList);

router.delete('/roleconfig/:ChainCodeID', isAuthenticated, verifyUserCanCall, roleconfig.deleteRoleConfig);

module.exports = router;