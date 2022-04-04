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
let logger = chainUtil.getLogger('Email-API');
let emailService = require('./../services/email/email')
let config = require('config');
let helper = require('../helpers/helper.js');
let user = require('../models/user.model')
const ShortID = require("shortid");



exports.sendEmail = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT NODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');
    try{
        let userExists = await user.isUserExists(req.body.email);
        if(userExists){
            let resFromMongo = await user.getByEmail(req.body.email);
            await user.deleteUser(resFromMongo)
        }
        let activationCode = ShortID.generate()
        req.body.activationCode = activationCode
        await user.storeVerificationCode(req.body)
        await emailService.sendEmail(req.body.email, activationCode)
        res.status(200).send({"result": "activation code has been sent to "+req.body.email})
    }catch(err){
        res.status(500).send({"error":err})
    }
}

exports.verifyEmail = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< CALLED END POINT NODE >>>>>>>>>>>>>>>>>');
    res.set('Content-Type', 'application/json');
    try{
        let resFromMongo = await user.getByEmail(req.body.email);
        if(resFromMongo.activationCode == req.body.activationCode){
            await user.deleteUser(resFromMongo)
            res.status(200).send({"result": "email verified successfully"})
        }else{
            res.status(500).send({"error":"email verification failed"})
        }
    }catch(err){
        res.status(500).send({"error":err})
    }
}
