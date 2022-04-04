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

const MongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');
const config = require('config');
const helper = require('../../helpers/fabric-helper');
const logger = helper.getLogger('mdb-connection');

class MDBConnection {
	constructor(logger) {
		this._collections = {};
		this._models = {};
		this._db = null;
		this._reconnectTimer = null;
		this.lastError = null;
		this.isConnected = false;
		this.onConnectCallback = null;
		this.logger = logger;
	}

	onConnect(cb) {
		if (this.isConnected) cb();
		this.onConnectCallback = cb;
	}

	connect(config) {
		this.config = config;

		const uri = config.uri;
		const options = Object.assign({}, config.options || {}, {
			promiseLibrary: Promise
		});

		if (this._reconnectTimer) {
			clearTimeout(this._reconnectTimer);
		}

		return MongoClient
			.connect(uri, options)
			.then(db => {
				this._db = db;
				this.isConnected = true;

				db.on('error', (err) => this._onError(err));
				db.on('close', () => this._onClose());
				db.on('reconnect', () => this._onReconnect());

				logger.info('[MDB] connect: ' + config.uri);

				return Promise
					.all(Object.keys(this._models).map(name => {
						let item = this._models[name];
						if (this._collections[name]) return;

						return this._createCollection(item.params);
					}))
					.then(() => {
						if (this.onConnectCallback) this.onConnectCallback();
					});
			})
			.catch(err => {
				logger.error(err, '[MDB] can not connect to the mongodb, uri:' + uri);
				return new Promise(resolve => {
					setTimeout(() => resolve(this.connect(config)), 5000);
				});
			});
	}

	_onError(err) {
		logger.error(err, 'MDB error');
		this.isConnected = false;
		this.lastError = err;
	}

	_onClose() {
		const db = this._db;

		if (this._reconnectTimer) {
			clearTimeout(this._reconnectTimer);
		}

		this._reconnectTimer = setTimeout(() => {
			db.removeAllListeners('error');
			db.removeAllListeners('reconnect');
			db.removeAllListeners('close');

			this._collections = {};
			this._db = null;
			this.connect(this.config);
		}, 70 * 1000);

		this.isConnected = false;
	}

	_onReconnect() {
		if (this._reconnectTimer) {
			clearTimeout(this._reconnectTimer);
		}

		this.isConnected = true;
	}

	collection(params, model) {
		const { name } = params;
		this._models[name] = {
			params,
			model
		};

		this._createCollection(params);

		return Object.keys(model)
			.reduce((obj, method) => {
				obj[method] = this._mdbConnection(model, method, name);
				return obj;
			}, {});
	}

	_createCollection(params) {
		if (!this.isConnected) return;

		const { name, indexes } = params;
		const options = Object.assign({}, params.opts || {}, { strict: false });

		return this._db
			.createCollection(name, options)
			.then(collection => {
				this._collections[name] = collection;

				if (indexes) {
					return collection.createIndexes(indexes);
				}
			})
			.catch(err => {
				logger.error(err, '[MDB] failed create collection');
			});
	}

	_mdbConnection(model, method, collectionName) {
		return (params1, params2, params3, params4) => {
			const $ = this._collections[collectionName];
			if (!$) {
				return Promise.reject(new Error('Database is unavailable'));
			}

			return model[method]($, params1, params2, params3, params4);
		};
	}
}

module.exports = MDBConnection;
