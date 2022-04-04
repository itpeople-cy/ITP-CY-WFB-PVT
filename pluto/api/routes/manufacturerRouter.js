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

let manufacturer = require('../controllers/manufacturerController');

router.post('/manufacturer', isAuthenticated, verifyUserCanCall, manufacturer.recordManufacturer);

router.put('/manufacturer', isAuthenticated, verifyUserCanCall, manufacturer.updateManufacturer);

router.get('/manufacturer', isAuthenticated, verifyUserCanCall, manufacturer.queryManufacturer);

router.get('/manufacturerhistory/:ManufacturerID', isAuthenticated, verifyUserCanCall, manufacturer.queryManufacturerHistory);

router.get('/manufacturerlist', isAuthenticated, verifyUserCanCall, manufacturer.queryManufacturerList);

router.delete('/manufacturer/:ManufacturerID', isAuthenticated, verifyUserCanCall, manufacturer.deleteManufacturer);

module.exports = router;