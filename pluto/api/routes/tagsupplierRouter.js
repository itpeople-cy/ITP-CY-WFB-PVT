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

let tagsupplier = require('../controllers/tagsupplierController');

router.post('/tagsupplier', isAuthenticated, verifyUserCanCall, tagsupplier.recordTagSupplier);

router.put('/tagsupplier', isAuthenticated, verifyUserCanCall, tagsupplier.updateTagSupplier);

router.get('/tagsupplier', isAuthenticated, verifyUserCanCall, tagsupplier.queryTagSupplier);

router.get('/tagsupplierhistory/:TagSupplierID', isAuthenticated, verifyUserCanCall, tagsupplier.queryTagSupplierHistory);

router.get('/tagsupplierlist', isAuthenticated, verifyUserCanCall, tagsupplier.queryTagSupplierList);

router.delete('/tagsupplier/:TagSupplierID', isAuthenticated, verifyUserCanCall, tagsupplier.deleteTagSupplier);

module.exports = router;