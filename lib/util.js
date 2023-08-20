let settings;
let nodes;
const axios = require('axios');
const qs = require('qs');
const BASE_URL = 'http://127.0.0.1';
const PATH = '/mobile';

function getPostConfig(json) {
  const config = {
    baseURL: BASE_URL + ':' + settings.redMobilePort,
    url: PATH,
    method: 'post',
    data: qs.stringify(json),
    headers: {
      Authorization: 'Bearer: ' + settings.redMobileAccessKey,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  return config;
}

function getGetConfig(params, timeout) {
  return {
    baseURL: BASE_URL + ':' + settings.redMobilePort,
    url: PATH,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer: ' + settings.redMobileAccessKey,
    },
    params: params,
    timeout: timeout,
  };
}

function sendSuccess(node, msg, res) {
  if (res.data) {
    msg.payload = res.data;
  }
  node.send(msg);
  node.status({
    fill: 'blue',
    shape: 'dot',
    text: 'success',
  });
}

function sendError(node, err) {
  const payload = err.response.data;
  node.error(payload);
  node.status({
    fill: 'red',
    shape: 'ring',
    text: payload,
  });
}

function generateOpts(n) {
  let opts = {};
  if (nodes.getNode(n.device)) {
    opts.address = nodes.getNode(n.device).address;
  }
  if (n.service) {
    opts.service = n.service;
  }
  if (n.characteristic) {
    opts.characteristic = n.characteristic;
  }
  return opts;
}

function postRequest(node, msg, json) {
  axios
    .request(getPostConfig(json))
    .then((res) => {
      sendSuccess(node, msg, res);
    })
    .catch((err) => {
      sendError(node, err);
    });
}

function getRequest(node, msg, params, timeout) {
  axios
    .request(getGetConfig(params, timeout))
    .then((res) => {
      sendSuccess(node, msg, res);
    })
    .catch((err) => {
      sendError(node, err);
    });
}

module.exports = {
  init: function (_runtime) {
    nodes = _runtime.nodes;
    settings = _runtime.settings;
  },
  getPostConfig: getPostConfig,
  getGetConfig: getGetConfig,
  sendSuccess: sendSuccess,
  sendError: sendError,
  generateOpts: generateOpts,
  postRequest: postRequest,
  getRequest: getRequest,
};
