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

let express = require('express');
let chainUtil = require('../helpers/fabric-helper.js');
let logger = chainUtil.getLogger('QrGen-API');
let config = require('config');
let helper = require('../helpers/helper.js');
let qr_gen = require('qr-image');

exports.qrCodeGenerator = function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT NODE >>>>>>>>>>>>>>>>>');
    
    if (req.params.QrID) {
        let qrCode = qr_gen.image(req.params.QrID, { size: 6, type: "svg" });

        res.type('svg');
        qrCode.pipe(res);

        logger.info("Successfully generated QR Code")
    } else {
        logger.error("Failed to generate QR Code. String to generate QR Code is not passed")
        return helper.sendResponse(res, null, new Error("String to generate QR Code is not passed"));
    }
}
