import { NodeAPI, Node, NodeMessageInFlow } from 'node-red';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { UtilJsonDef } from './@types/util';
import qs from 'qs';

const BASE_URL = 'http://127.0.0.1';
const PATH = '/mobile';

export function generateGetConfig(
  RED: NodeAPI,
  params: any,
  timeout: number
): AxiosRequestConfig<any> {
  return {
    baseURL: BASE_URL + ':' + RED.settings['redMobilePort'],
    url: PATH,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer: ' + RED.settings['redMobileAccessKey'],
    },
    params: params,
    timeout: timeout,
  };
}

function sendSuccess(
  node: Node,
  msg: NodeMessageInFlow,
  res: AxiosResponse<any, any>
) {
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

function sendError(node: Node, err: any) {
  const payload = err.response.data;
  node.error(payload);
  node.status({
    fill: 'red',
    shape: 'ring',
    text: payload,
  });
}

export function generatePostConfig(RED: NodeAPI): AxiosRequestConfig<string> {
  return {
    baseURL: BASE_URL + ':' + RED.settings['redMobilePort'],
    headers: {
      Authorization: 'Bearer: ' + RED.settings['redMobileAccessKey'],
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
}

export function postRequest(
  RED: NodeAPI,
  node: Node,
  msg: NodeMessageInFlow,
  json: UtilJsonDef
) {
  axios
    .post(PATH, qs.stringify(json), generatePostConfig(RED))
    .then((res) => {
      sendSuccess(node, msg, res);
    })
    .catch((err) => {
      sendError(node, err);
    });
}

export function getRequest(
  RED: NodeAPI,
  node: Node,
  msg: NodeMessageInFlow,
  params,
  timeout: number
) {
  axios
    .request(generateGetConfig(RED, params, timeout))
    .then((res) => {
      sendSuccess(node, msg, res);
    })
    .catch((err) => {
      sendError(node, err);
    });
}
