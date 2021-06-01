const axios = require('axios');
const WebSocket = require('ws');

function Measurify(url, version, tenant, api_token, username, password) {
  this.url = url;
  this.version = version;
  this.api_token = api_token;
  this.username = username;
  this.password = password;
  this.tenant = tenant;
  this.token = null;
  this.socket = null;
}

Measurify.prototype.init = async function() {
  this.tenant = await this.postTenant();
  this.token = await this.postLogin();
  this.socket = await this.createStream();
}

Measurify.prototype.createStream = async function() {
  try {
    const version = this.version;
    const token = this.token;
    const server = this.server;
    return new Promise(function(resolve, reject) {
      const ws_url = "wss://localhost:443" + '/' + version + '/streams?token=' + token;
      const socket = new  WebSocket(ws_url);
      socket.onopen = function() { resolve(socket); };
      socket.onerror = function(err) { reject(err); };
    });
  }
  catch (error) { console.error("createStream: " + error); }
}

Measurify.prototype.postTenant = async function() {
  try { 
    const response = await axios({ 
      method: 'post',
      url: this.url + '/' + this.version + '/tenants',
      headers: { 'Authorization': this.api_token }, 
      data: { _id: this.tenant, admin_username: this.admin_username, admin_password: this.admin_password, passwordhash: false }
    });
    await response.data;
    return tenant;
  } 
  catch (error) { 
    if(error.response.data.details.includes('duplicate key error collection')) return this.tenant;
    else console.error("postTenant: " + error.response.data); 
  }
}

Measurify.prototype.postLogin = async function() {
  try { 
    const response = await axios({ 
      method: 'post',
      url: this.url + '/' + this.version + '/login',
      data: { username: this.username, password: this.password, tenant: await this.tenant }
    });
    return response.data.token;
  } 
  catch (error) { console.error("postLogin: " + error); }
}

Measurify.prototype.drop = async function() {
      try { 
        const response = await axios({ 
          method: 'delete',
          url: this.url + '/' + this.version + '/demo',
          headers: { 'Authorization': this.token }
        });
        await response.data;
        await this.init();
      } 
      catch (error) { console.error("drop: " + error.response.data); }
} 

Measurify.prototype.getInfo = async function() {
  try { 
    const response = await axios({ 
      method: 'get',
      url: this.url + '/' + this.version + '/info',
      headers: { 'Authorization': this.token }
    });
    return await response.data;
  } 
  catch (error) { console.error("getInfo: " + error.response.data); }
}

Measurify.prototype.postThing = async function(thing) {
    try { 
      const response = await axios({ 
        method: 'post',
        url: this.url + '/' + this.version + '/things',
        headers: { 'Authorization': this.token }, 
        data: { _id: thing }
      });
      return await response.data;
    } 
    catch (error) { console.error("postThing: " + error.response.data); }
}

Measurify.prototype.postFeature = async function(feature, items) {
    try { 
      const response = await axios({ 
        method: 'post',
        url: this.url + '/' + this.version + '/features',
        headers: { 'Authorization': this.token }, 
        data: { _id: feature, items: items }
      });
      return await response.data;
    } 
    catch (error) { console.error("postFeature: " + error.response.data); }
}

Measurify.prototype.postDevice = async function(device, features) {
    try { 
      const response = await axios({ 
        method: 'post',
        url: this.url + '/' + this.version + '/devices',
        headers: { 'Authorization': this.token }, 
        data: { _id: device, features: features.map(f => f._id) }
      });
      return await response.data;
    } 
    catch (error) { console.error("postDevice: " + error); }
}

Measurify.prototype.streamMeasurements = async function(data) {
  try { 
    const socket = this.socket;
    socket.send(JSON.stringify(data));
    return new Promise(function(resolve, reject) { socket.onmessage = function (event) { resolve(event.data); }; });
  } 
  catch (error) { console.error("streamMeasurements: " + error); }
}

Measurify.prototype.postMeasurements = async function(data) {
    try { 
        const response = await axios({ 
            method: 'post',
            url: this.url + '/' + this.version + '/measurements',
            headers: { 'Authorization': this.token }, 
            data: data
        });
      return await response.data;
    } 
    catch (error) { console.error("postMeasurements: " + error.response.data); }
}

module.exports = Measurify;