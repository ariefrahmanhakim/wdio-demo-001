import { setWorldConstructor } from '@cucumber/cucumber';

export interface World {
  map: Record<string, any>;
  headers: Record<string, any>;
  body: any;
  param: Record<string, any>;
  form: Record<string, any>;
  service: string;
  endpoint: string;
  responseBody: string;
  resp: any; // This is the response object
}

setWorldConstructor(function () {
  this.map = {};
  this.headers = {};
  this.body = {};
  this.param = {};
  this.form = {};
  this.service = '';
  this.endpoint = '';
  this.responseBody = '';
  this.resp = null;
});
