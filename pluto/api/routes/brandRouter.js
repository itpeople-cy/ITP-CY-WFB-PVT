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

let brand = require('../controllers/brandController');

router.post('/brand', isAuthenticated, verifyUserCanCall, brand.recordBrand);

router.put('/brand', isAuthenticated, verifyUserCanCall, brand.updateBrand);

router.get('/brand', isAuthenticated, verifyUserCanCall, brand.queryBrand);

router.get('/brand/:taggingtechnology', isAuthenticated, verifyUserCanCall, brand.queryBrandbyTagTechnology);

router.get('/brandhistory/:BrandID', isAuthenticated, verifyUserCanCall, brand.queryBrandHistory);

router.get('/brandlist', isAuthenticated, verifyUserCanCall, brand.queryBrandList);

router.delete('/brand/:BrandID', isAuthenticated, verifyUserCanCall, brand.deleteBrand);

router.get('/brandbymanufacturer',isAuthenticated, verifyUserCanCall, brand.queryBrandbyManufacturer)
module.exports = router;