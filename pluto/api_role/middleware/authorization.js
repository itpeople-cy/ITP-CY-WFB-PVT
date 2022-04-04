'use strict';

const RBAC = require('easy-rbac');
const RBAC_CONFIG = require('../config/rbac-config.js');

const roleVerifier = new RBAC(RBAC_CONFIG);


module.exports = (req, res, next) => {
  const isAuthorised = roleVerifier.can(req.method + ':' + req.url.toLowerCase(), req.decoded.role);
  if (isAuthorised) {
    res.locals.decoded = req.decoded;
    next();
  } else if ((req.url.substr(0, '/images'.length) === '/images') || (req.url.substr(0, '/lib'.length) === '/lib') || (req.url.toLowerCase() === '/favicon.ico') || (req.url.substr(0, '/css'.length) === '/css') || (req.url.substr(0, '/swagger'.length) === '/swagger')) {
    next();
  } else if ((req.url.toLowerCase() === '/v1')) {
    res.locals.decoded = req.decoded;
    next();
  } else {
    return res.status(401).send({
      success: false,
      message: 'User is not authorized to perform this action.'
    });
  }
};
