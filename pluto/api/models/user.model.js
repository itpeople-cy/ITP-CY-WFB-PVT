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

const passwordUtils = require('../helpers/util');
const mdb = require('./mdb');
const ObjectId = require('mongodb').ObjectId;
const Promise = require('bluebird');

const User = mdb.collection({
    name: 'users',
    indexes: [
        { key: { email: 1 }, unique: true }
    ]
}, {
        create: ($, params) => {
            return passwordUtils
                .hash(params.password)
                .then(hash => {
                    let user = {
                        email: params.email,
                        password: hash,
                        kvsPassword: hash,
                        metaData: params.metaData,
                        org: params.org,
                        userID:params.userID,
                        role: params.role,
                        activationCode: params.activationCode,
                        createdAt: new Date()
                    };

                    return $
                        .insertOne(user)
                        .then(() => user);
                })
                .catch(err => {
                    if (err.code === 11000) {
                        return Promise.reject(new Error('Email already used'));
                    }

                    return Promise.reject(err);
                });
        },

        auth: ($, email, password) => {
            return $
                .find({ email: email })
                .limit(1)
                .next()
                .then(user => {
                    if (!user) throw new Error('Invalid password or email');;

                    return passwordUtils
                        .isHashEqual(password, user.password)
                        .then(() => {
                            delete user.password;
                            delete user.kvsPassword;
                            return user;
                        });
                });
        },

        getById: ($, id) => {
            return $
                .find({ _id: new ObjectId(id) }, { password: 0 })
                .limit(1)
                .next()
                .then(user => {
                    if (!user) throw new Error('User not found');
                    return user;
                });
        },

        getByEmail: ($, email) => {
            return $
                .find({ email: email }, { password: 0 }, { _id: 1 })
                .limit(1)
                .next()
                .then(user => {
                    if (!user) throw new Error('User not found');
                    return user;
                });
        },

        getByRole: ($, role) => {
            return $
                .find({ role })
                .sort({ name: 1 })
                .toArray();
        },

        updateUser: ($, id, data) => {
            const { metaData, role, activationCode } = data;
            const sQuery = { _id: new ObjectId(id) };

            return $
                .find(sQuery, { password: 0 })
                .limit(1)
                .next()
                .then(user => {
                    if (!user) throw new Error(`User not found`);

                    const uQuery = { $set: { metaData, role, activationCode } };

                    return $
                        .findOneAndUpdate(sQuery, uQuery, { projection: { password: 0 }, returnOriginal: false })
                        .then(r => {
                            if (r.lastErrorObject.n !== 1) {
                                throw new Error(`User not found`);
                            }
                            return r.value;
                        });
                });
        },

        updatePassword: ($, id, data) => {
            const { password, newPassword } = data;
            const sQuery = { _id: new ObjectId(id) };

            return $
                .find(sQuery, { password: 1, email: 1 })
                .limit(1)
                .next()
                .then(user => {
                    if (!user) return Promise.reject('User not found');

                    return Promise
                        .props({
                            password: passwordUtils.isHashEqual(password, user.password),
                            newPasswordHash: passwordUtils.hash(newPassword),
                            user
                        })
                        .catch(() => Promise.reject('Invalid old password'));
                })
                .then(data => {
                    const { user, newPasswordHash } = data;
                    const uQuery = { $set: { password: newPasswordHash } };

                    return $
                        .updateOne(sQuery, uQuery)
                        .then(() => user);
                });
        },

        storeVerificationCode: ($, params) => {
            let user = {
                email: params.email,
                activationCode: params.activationCode
            };

            return $
                .insertOne(user)
                .then(() => user)
                .catch(err => {
                    if (err.code === 11000) {
                        return Promise.reject(new Error('Email already used'));
                    }

                    return Promise.reject(err);
                });
        },


        deleteUser: ($, params) => {
            let user = {
                email: params.email,
                activationCode: params.activationCode
            };

            return $
                .deleteOne(user)
                .then(() => user)
                .catch(err => {
                    if (err.code === 11000) {
                        return Promise.reject(err);
                    }

                    return Promise.reject(err);
                });
        },

        isUserExists: ($, email) => {
            return $
                .find({ email: email })
                .limit(1)
                .next()
                .then(user => {
                    if (user) {
                        return true;
                    } else {
                        return false;
                    }
                })
        },
    });


module.exports = User;
