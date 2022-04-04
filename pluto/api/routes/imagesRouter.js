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

let images = require('../controllers/imagesController');

router.post('/images', isAuthenticated, verifyUserCanCall, images.recordImages);

router.put('/images', isAuthenticated, verifyUserCanCall, images.updateImages);

router.get('/images/:ImageID', isAuthenticated, verifyUserCanCall, images.queryImages);

router.get('/imageshistory/:ImageID', isAuthenticated, verifyUserCanCall, images.queryImagesHistory);

router.post('/imageslist', isAuthenticated, verifyUserCanCall, images.queryImagesList);

router.delete('/images/:ImageID', isAuthenticated, verifyUserCanCall, images.deleteImages);

module.exports = router;