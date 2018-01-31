import 'core-js/es6/promise';

import { stringify } from 'qs';
import { User, EventName, PublicEventRequest } from '../types';
import settings from '../settings';

const getEndpoint = (endpoint?: string): string =>
  !endpoint ? (settings.searchApiUrl + '/feedback') : endpoint;

const makeQuery = (query) => stringify({ ...query, t_client: Date.now() });

// tslint:disable-next-line:variable-name
const ImageRequest = (data: any, endpoint?: string) =>
  new Promise((resolve, reject) => {
    const image = window.document.createElement('img');
    image.onload = resolve;
    image.onerror = resolve;
    image.src = `${getEndpoint(endpoint)}?${makeQuery(data)}`;
  });

// tslint:disable-next-line:variable-name
const BeaconRequest = (data: any, endpoint?: string) =>
  new Promise((resolve, reject) => {
    navigator.sendBeacon(getEndpoint(endpoint), makeQuery(data));
    resolve();
  });

export const request = (function() {
  if (typeof global.navigator !== 'undefined' && global.navigator.sendBeacon) return BeaconRequest;
  if (typeof global.window !== 'undefined') return ImageRequest;
  if (!process.env.BROWSER) {
    return (data: any, endpoint?: string) =>
      new Promise((resolve, reject) => {
        const http = require('http');
        http.get(`${getEndpoint(endpoint).replace('https', 'http')}?${makeQuery(data)}`)
        resolve()
      });
  }
  throw new Error('Can not determinate request type');
})();


type Data = {
  key: string;
  user: User;
  event: string;
  properties: PublicEventRequest;
};
