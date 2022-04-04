

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
const bodyParser = require('body-parser');
const http = require('http');
const helmet = require('helmet');
const app = express();
const cors = require('cors');
const config = require('config');
const helper = require('./helpers/fabric-helper');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger_role.json');
const host = process.env.HOST || config.host;
const port = process.env.PORT || config.port;
const logger = helper.getLogger('PROJECT-KICKER-NODE');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'local'
}

app.options('*', cors());
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const routes = require('./routes/index.js');
app.use(routes);

const server = http.createServer(app).listen(port, function () {
  Promise.all([helper.getAdminUser("org1"), helper.getAdminUser("org2")]).then((result) => {
    logger.info('successfully enrolled admin users');
  }, (err) => {
    logger.error('failed to enroll admin users', err);
  });

  logger.info('****************** SERVER STARTED ************************');
  logger.info('**************  http://' + host + ':' + port + ' ******************');
});

server.timeout = 240000;
