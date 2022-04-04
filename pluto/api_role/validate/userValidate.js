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
'use strict';
const Joi = require('joi');

const keys = {
    email: Joi.string().trim().lowercase().max(100).required(),
    password: Joi.string().required(),
    org: Joi.string().required(),
    role: Joi.string().required()
};

const UserValidate = {

    login: (req, res, next) => {
        const schema = Joi.object().keys(
            {
                email: keys.email,
                password: keys.password,
                org: keys.org
            },
            { convert: true }
        );

        Joi.validate(req.body, schema, (err, value) => {
            if (err) return next(res.status(500).send(err.message));

            req.body = value;
            next();
        });
    },

    register: (req, res, next) => {
        const schema = Joi.object().keys(
            {
                email: keys.email,
                password: keys.password,
                org: keys.org,
                role: keys.role
            },
            { convert: true }
        );

        Joi.validate(req.body, schema, (err, value) => {
            if (err) return next(res.status(500).send(err.message));

            req.body = value;
            next();
        });
    },

    updatePassword: (req, res, next) => {
        const schema = Joi.object().keys(
            {
                password: keys.password,
                newPassword: keys.password
            },
            { convert: true }
        );

        Joi.validate(req.body, schema, (err, value) => {
            if (err) return next(res.status(500).send(err.message));

            req.body = value;
            next();
        });
    },
};

module.exports = UserValidate;

