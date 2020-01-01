const axios = require('axios');
const qs = require('qs');
const BASE_URL = 'http://127.0.0.1';
const PATH =  '/mobile';

let dbname;
let redSettings;

function DB(_settings, _dbname){
    redSettings = _settings;
    dbname = _dbname;
}

DB.prototype.all = (sql, params, callback) => {
    const json =  {
        method: "sqlite-all",
        dbname: dbname,
        payload: sql,
        params: params
    };
    const config = generateConfig(json);
    axios.request(config).then((res) => {
        callback(null, res.data);
    }).catch((err) => {
        callback(new Error(err.response.data));
    });
};

DB.prototype.exec = (sql, callback) => {
    const json =  {
        method: "sqlite-exec",
        dbname: dbname,
        payload: sql,
    };
    const config = generateConfig(json);
    axios.request(config).then((res) => {
        callback(null);
    }).catch((err) => {
        callback(new Error(err.response.data));
    });
};

DB.prototype.loadExtension = (extension, callback) => {
    callback(new Error("extension is not supported"));
};

DB.prototype.close = function(done){
    const json =  {
        method: "sqlite-close",
        dbname: dbname
    };
    const config = generateConfig(json);
    axios.request(config).then((res) => {
        done();
    }).catch((err) => {
        done();
    });
};

DB.prototype.delete = function(callback){
    const json =  {
        method: "sqlite-delete",
        dbname: dbname
    };
    const config = generateConfig(json);
    axios.request(config).then((res) => {
        callback(null, res.data);
    }).catch((err) => {
        callback(new Error(err.response.data));
    });
};

function generateConfig(json){
    return {
        baseURL: BASE_URL + ":" + redSettings.redMobilePort,
        url: PATH,
        method: "post",
        data: qs.stringify(json),
        headers: {
            'Authorization': "Bearer: " + redSettings.redMobileAccessKey,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
}

module.exports = DB;
