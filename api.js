
const axios = require('axios');

const URL = process.env.URL;
const VERSION = process.env.VERSION;

exports.login = async function(username, password) {
  try { 
    const response = await axios({ 
      method: 'post',
      url: URL + '/' + VERSION + '/login',
      data: { username: username, password: password }
    });
    return await response.data.token;
  } 
  catch (error) { console.error(error.data); }
}

exports.drop = async function(token) {
    try { 
        const response = await axios({ 
          method: 'delete',
          url: URL + '/' + VERSION + '/demo',
          headers: { 'Authorization': token }
        });
        return await response.data;
      } 
      catch (error) { console.error(error.data); }
} 

exports.info = async function(token) {
  try { 
    const response = await axios({ 
      method: 'get',
      url: URL + '/' + VERSION + '/info',
      headers: { 'Authorization': token }
    });
    return await response.data;
  } 
  catch (error) { console.error(error.data); }
}

exports.createThing = async function(token, thing) {
    try { 
      const response = await axios({ 
        method: 'post',
        url: URL + '/' + VERSION + '/things',
        headers: { 'Authorization': token }, 
        data: { _id: thing }
      });
      return await response.data;
    } 
    catch (error) { console.error(error.data); }
}

exports.createItem = async function(item, unit, type, dimension) {
   return {
        name: item,
        unit: unit,
        type: type,
        dimension: dimension
    }
}  

exports.createFeature = async function(token, feature, items) {
    try { 
      const response = await axios({ 
        method: 'post',
        url: URL + '/' + VERSION + '/features',
        headers: { 'Authorization': token }, 
        data: { _id: feature, items: items }
      });
      return await response.data;
    } 
    catch (error) { console.error(error.data); }
}

exports.createDevice = async function(token, device, features) {
    try { 
      const response = await axios({ 
        method: 'post',
        url: URL + '/' + VERSION + '/devices',
        headers: { 'Authorization': token }, 
        data: { _id: device, features: features.map(f => f._id) }
      });
      return await response.data;
    } 
    catch (error) { console.error(error.data); }
}

exports.createSample = async function(values) {
    return { values: values };
} 


exports.prepareMeasurements = async function(thing, device, feature, samples, size) {
    const data = [];
    for(let i=0; i<size; i++) { data.push({thing: thing._id, device: device._id, feature: feature._id, samples: samples}) };
    return data;
}

exports.createMeasurements = async function(token, data) {
    try { 
        const response = await axios({ 
            method: 'post',
            url: URL + '/' + VERSION + '/measurements',
            headers: { 'Authorization': token }, 
            data: data
        });
      return await response.data;
    } 
    catch (error) { console.error(error); }
}

exports.getMeasurements = async function(token, limit, page) {
    try { 
      const response = await axios({ 
        method: 'get',
        url: URL + '/' + VERSION + '/measurements?limit=' + limit + '&page=' + page,
        headers: { 'Authorization': token }
      });
      return await response.data;
    } 
    catch (error) { console.error(error.data); }
}

exports.getMeasurementsCount = async function(token) {
    try { 
      const response = await axios({ 
        method: 'get',
        url: URL + '/' + VERSION + '/measurements/count',
        headers: { 'Authorization': token }
      });
      return await response.data.size;
    } 
    catch (error) { console.error(error.data); }
}
