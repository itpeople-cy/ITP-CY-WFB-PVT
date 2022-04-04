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

let tag = require('../controllers/tagController');

router.post('/tag', isAuthenticated, verifyUserCanCall, tag.recordTag);

router.put('/tag', isAuthenticated, verifyUserCanCall, tag.updateTag);

router.get('/tag/:TagID', isAuthenticated, verifyUserCanCall, tag.queryTag);

router.get('/taghistory/:TagID', isAuthenticated, verifyUserCanCall, tag.queryTagHistory);

router.get('/taglist', isAuthenticated, verifyUserCanCall, tag.queryTagList);

router.delete('/tag/:TagID', isAuthenticated, verifyUserCanCall, tag.deleteTag);

router.get('/unassignedtags/:tagtechnology', isAuthenticated, verifyUserCanCall, tag.queryUnassignedTags);

router.get('/scantag/:tagid', isAuthenticated, verifyUserCanCall, tag.scanTag);

router.post('/authenticatetag', isAuthenticated, verifyUserCanCall, tag.authenticateTag);

module.exports = router;