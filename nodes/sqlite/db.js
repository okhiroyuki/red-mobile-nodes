const axios = require('axios');
const qs = require('qs');
const BASE_URL = 'http://127.0.0.1';
const PATH =  '/mobile';

let _db;

function DB(db){
    _db = db;
}

DB.prototype.all = (sql, params, callback) => {
    const json =  {
        method: "db-all",
        db: _db,
        sql: sql,
        params: params
    };
    const config = generateConfig(json);
    axios.request(config).then((res) => {
        callback(null);
    }).catch((error) => {
        callback(err);
        done();
    });
}

DB.prototype.exec = (sql, callback) => {
    const json =  {
        method: "db-exec",
        db: _db,
        sql: sql,
    };
    const config = generateConfig(json);
    axios.request(config).then((res) => {
        callback(null);
    }).catch((error) => {
        callback(err);
        done();
    });
}      

DB.prototype.loadExtension = (extension, callback) => {
    callback(new Error("extension is not supported"));
}

DB.prototype.close = function(done){
    const json =  {
        method: "db-close",
        db: _db
    };
    const config = generateConfig(json);
    axios.request(config).then((res) => {
        done();
    }).catch((error) => {
        done();
    });
}

function generateConfig(json){
    return {
        baseURL: BASE_URL + ":" + RED.settings.redMobilePort,
        url: PATH,
        method: "post",
        data: qs.stringify(json),
        headers: {
            'Authorization': "Bearer: " + RED.settings.redMobileAccessKey,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
}

module.exports = DB;