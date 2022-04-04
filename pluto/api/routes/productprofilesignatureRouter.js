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

let productprofilesignature = require('../controllers/productprofilesignatureController');

router.post('/productprofilesignature', isAuthenticated, verifyUserCanCall, productprofilesignature.recordProductProfileSignature);

router.put('/productprofilesignature', isAuthenticated, verifyUserCanCall, productprofilesignature.updateProductProfileSignature);

router.get('/productprofilesignature/:StyleID', isAuthenticated, verifyUserCanCall, productprofilesignature.queryProductProfileSignature);

router.get('/productprofilesignaturehistory/:StyleID', isAuthenticated, verifyUserCanCall, productprofilesignature.queryProductProfileSignatureHistory);

router.get('/productprofilesignaturelist', isAuthenticated, verifyUserCanCall, productprofilesignature.queryProductProfileSignatureList);

router.delete('/productprofilesignature/:StyleID', isAuthenticated, verifyUserCanCall, productprofilesignature.deleteProductProfileSignature);

module.exports = router;