/**
 * Copyright 2018 IT People Corporation. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
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

const config = require('config');
const helper = require('../helpers/fabric-helper');
const logger = helper.getLogger('mdb');

const MDBConnection = require('../common/db/mdb-connection');
const MDB = new MDBConnection();

MDB.connect({
  uri: config.mongo.uri,
  options: config.mongo.options
});

module.exports = MDB;
