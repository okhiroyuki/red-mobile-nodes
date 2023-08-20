const axios = require('axios');
const qs = require('qs');
const BASE_URL = 'http://127.0.0.1';
const PATH = '/mobile';

let dbname;
let redSettings;

function DB(_settings, _dbname) {
  redSettings = _settings;
  dbname = _dbname;
}

DB.prototype.all = (id, sql, params, callback) => {
  const json = {
    id: id,
    method: 'sqlite-all',
    dbname: dbname,
    payload: sql,
    params: params,
  };
  const config = generateConfig(json);
  axios
    .request(config)
    .then((res) => {
      callback(null, res.data);
    })
    .catch((err) => {
      callback(new Error(err.response.data));
    });
};

DB.prototype.exec = (id, sql, callback) => {
  const json = {
    id: id,
    method: 'sqlite-exec',
    dbname: dbname,
    payload: sql,
  };
  const config = generateConfig(json);
  axios
    .request(config)
    .then(() => {
      callback(null);
    })
    .catch((err) => {
      callback(new Error(err.response.data));
    });
};

DB.prototype.loadExtension = (extension, callback) => {
  callback(new Error('extension is not supported'));
};

DB.prototype.close = function (id, done) {
  const json = {
    id: id,
    method: 'sqlite-close',
    dbname: dbname,
  };
  const config = generateConfig(json);
  axios
    .request(config)
    .then(() => {
      done();
    })
    .catch(() => {
      done();
    });
};

DB.prototype.delete = function (id, callback) {
  const json = {
    id: id,
    method: 'sqlite-delete',
    dbname: dbname,
  };
  const config = generateConfig(json);
  axios
    .request(config)
    .then((res) => {
      callback(null, res.data);
    })
    .catch((err) => {
      callback(new Error(err.response.data));
    });
};

function generateConfig(json) {
  return {
    baseURL: BASE_URL + ':' + redSettings.redMobilePort,
    url: PATH,
    method: 'post',
    data: qs.stringify(json),
    headers: {
      Authorization: 'Bearer: ' + redSettings.redMobileAccessKey,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
}

module.exports = DB;
