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
 * Author: Sandeep Pulluru <sandeep.pulluru@itpeoplecorp.com>
 */

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const helper = require('../helpers/fabric-helper');
const config = require('config');
const logger = helper.getLogger('userController');

const jwt = require('jsonwebtoken');
router.use(bodyParser.urlencoded({ extended: true }));

const user = require('../models/user.model');

exports.login = async function (req, res) {
    logger.debug(">>> inside userController.login() ...")
    const email = req.body.email;
    const password = req.body.password;
    let orgName;
    let role;
    const errorMsg = {}
    errorMsg.message = "Invalid email/password";

    try {
        const defaultemail = "admin";
        const defaultpw = "adminpw";
        if (email == defaultemail && password == defaultpw) {
            orgName = "org1";
            role = "admin";
        } else {
            //get the role and orgName for the account
            let resFromMongo = await user.getByEmail(email);
            if (!resFromMongo) {
                errorMsg.message = "Failed to get " + email;
                return res.status(401).send(errorMsg)
            }
            orgName = resFromMongo.org;
            role = resFromMongo.role;
        }

        let registrar = await helper.getRegistrarForOrg(orgName)
        if (!email || !password) {
            errorMsg.message = "email and password are required";
            return res.status(401).send(errorMsg)
        }
        try {
            let response = await helper.getRegisteredUser(email, orgName);
            if (!response) {
                errorMsg.message = "Failed to get " + email;
                return res.status(401).send(errorMsg)
            }

            let userID = '';
            let isPasswordValid = false;
            if (email == registrar.enrollId && password == registrar.enrollSecret) {
                isPasswordValid = true;
            } else {
                let userMdb = await user.auth(email, password);
                userID = userMdb.userID;
                // isPasswordValid = true;
                if (role == userMdb.role) {
                    isPasswordValid = true;
                } else {
                    isPasswordValid = false;
                }
            }

            if (isPasswordValid) {
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + parseInt(config.jwt_expiretime),
                   _id: userID,
                    email: email,
                    orgName: orgName,
                    role: role
                }, config.secret)
                const response = {
                    "accessToken": token,
                    "email": email
                };
                return res.status(200).send(JSON.stringify(response))
            } else {
                errorMsg.message = "Invalid email/password";
                return res.status(401).send(errorMsg)
            }
        }
        catch (error) {
            logger.error(error);
            return res.status(401).send(errorMsg);
        }
    }
    catch (error) {
        logger.error(error);
        return res.status(401).send(errorMsg);
    }
}

exports.register = async function (req, res) {
    logger.debug(">>> inside userController.createUser() ...")
    logger.debug(">>> userController.createUser() : req.body: %s", req.body);

    const errorMsg = {}
    errorMsg.message = "Error registering user";

    try {
        await user.create(req.body);
        let response = await helper.registerUser(req.body.email, req.body.password, req.body.org, req.body.role, true);

        res.status(200).send(response);
    } catch (error) {
        logger.error(error);
        res.status(500).send(errorMsg);
    };
}

exports.updatePassword = async function (req, res) {
    logger.debug(">>> inside userController.updatePassword() ...")
    logger.debug(">>> userController.updatePassword() : req.body: %s", req.body.toString());

    const errorMsg = {}
    errorMsg.message = "Error updating password";

    try {
        await user.updatePassword(req.decoded._id, req.body);
        let response = await helper.updatePassword(req.decoded.email, req.body.newPassword, req.decoded.orgName, true);

        res.status(200).send(response);
    } catch (error) {
        logger.error(error);
        res.status(500).send(errorMsg);
    };
}