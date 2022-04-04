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

let retailer = require('../controllers/retailerController');

router.post('/retailer', isAuthenticated, verifyUserCanCall, retailer.recordRetailer);

router.put('/retailer', isAuthenticated, verifyUserCanCall, retailer.updateRetailer);

router.get('/retailer', isAuthenticated, verifyUserCanCall, retailer.queryRetailer);

router.get('/retailerhistory/:RetailerID', isAuthenticated, verifyUserCanCall, retailer.queryRetailerHistory);

router.get('/retailerlist', isAuthenticated, verifyUserCanCall, retailer.queryRetailerList);

router.delete('/retailer/:RetailerID', isAuthenticated, verifyUserCanCall, retailer.deleteRetailer);

module.exports = router;