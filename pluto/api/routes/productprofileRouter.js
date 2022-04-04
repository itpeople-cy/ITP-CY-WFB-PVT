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

let productprofile = require('../controllers/productprofileController');

router.post('/productprofile', isAuthenticated, verifyUserCanCall, productprofile.recordProductProfile);

router.put('/productprofile', isAuthenticated, verifyUserCanCall, productprofile.updateProductProfile);

router.get('/productprofile/:StyleID', isAuthenticated, verifyUserCanCall, productprofile.queryProductProfile);

router.get('/productprofilehistory/:StyleID', isAuthenticated, verifyUserCanCall, productprofile.queryProductProfileHistory);

router.get('/productprofilelist', isAuthenticated, verifyUserCanCall, productprofile.queryProductProfileList);

router.delete('/productprofile/:StyleID', isAuthenticated, verifyUserCanCall, productprofile.deleteProductProfile);

router.get(`/productprofilebybrand/:brandid`,isAuthenticated, verifyUserCanCall, productprofile.queryProductProfilebyBrand)

module.exports = router;