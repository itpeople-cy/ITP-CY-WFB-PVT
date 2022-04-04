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

let product = require('../controllers/productController');

router.post('/product', isAuthenticated, verifyUserCanCall, product.recordProduct);

router.put('/product', isAuthenticated, verifyUserCanCall, product.updateProduct);

router.get('/scanproductcode/:productid', isAuthenticated, verifyUserCanCall, product.queryProduct);

router.get('/salescantag/:productid', isAuthenticated, verifyUserCanCall, product.saleScanTag);

router.get('/producthistory/:ProductID', isAuthenticated, verifyUserCanCall, product.queryProductHistory);

//router.get('/productlist', isAuthenticated, verifyUserCanCall, product.queryProductList);

router.delete('/product/:ProductID', isAuthenticated, verifyUserCanCall, product.deleteProduct);

router.get('/untaggedproducts/:brandID', isAuthenticated, verifyUserCanCall, product.queryUntaggedProductsbyBrand);

router.get('/unshippedproducts', isAuthenticated, verifyUserCanCall, product.queryUnshippedProducts);

router.get('/productlist', isAuthenticated, verifyUserCanCall, product.queryProductbyRetailer);

router.get('/productsbybrand/:brandID', isAuthenticated, verifyUserCanCall, product.queryProductsByBrand);

router.post('/assigntagtoproduct', isAuthenticated, verifyUserCanCall, product.assignTagtoProduct);



module.exports = router;