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

let transaction = require('../controllers/transactionController');

router.post('/transaction', isAuthenticated, verifyUserCanCall, transaction.recordTransaction);

router.put('/transaction', isAuthenticated, verifyUserCanCall, transaction.updateTransaction);

router.get('/transaction/:TransactionID', isAuthenticated, verifyUserCanCall, transaction.queryTransaction);

router.get('/transactionhistory/:TransactionID', isAuthenticated, verifyUserCanCall, transaction.queryTransactionHistory);

router.get('/transactionlist', isAuthenticated, verifyUserCanCall, transaction.queryTransactionList);

router.delete('/transaction/:TransactionID', isAuthenticated, verifyUserCanCall, transaction.deleteTransaction);

router.post('/verifycert', isAuthenticated, verifyUserCanCall, transaction.verifyCertificateHash);
module.exports = router;