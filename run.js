
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: 'variables.env' });

const api = require('./api.js');
const time = require('./time.js');
const os = require('os');
const progress = require('cli-progress');

async function deleteContens() {
  const token = await api.login(process.env.USERNAME, process.env.PASSWORD);
  await api.drop(token);
}

async function getToken() {
  const token = await api.login('admin', 'admin');
  return token
} 

async function createStaticContens() {
  const token = await api.login('admin', 'admin');
  const thing = await api.createThing(token, 'test-thing-1');
  const item01 = await api.createItem('item-1', 'unit-1', 'number', '0');
  const item02 = await api.createItem('item-1', 'unit-1', 'number', '0');
  const item03 = await api.createItem('item-1', 'unit-1', 'number', '0');
  const feature = await api.createFeature(token, 'feature-1', [item01, item02, item03]);
  const device = await api.createDevice(token, 'device-1', [feature] );
  return {token: token, thing:thing, feature: feature, device:device} 
} 

async function prepareMeasurements(env, size) {
  const measurements = api.prepareMeasurements(env.thing, env.device, env.feature, [await api.createSample([10.2, 4.3, 2.7])], size);
  return measurements;
} 

async function createMeasurements(token, measurements, batch) {
  const size = Math.floor(measurements.length / batch);
  const bar = new progress.SingleBar({}, progress.Presets.shades_classic);
  bar.start(size, 0);
  for(let i=0; i<size; i++) {
    bar.update(i+1);
    data = measurements.slice(i*batch, i*batch+batch);
    await api.createMeasurements(token, data);
  }
  bar.stop();
} 

async function getMeasurements(token, size, batch) {
  const counter = Math.floor(size / batch);
  const bar = new progress.SingleBar({}, progress.Presets.shades_classic);
  bar.start(counter, 0);
  for(let i=1; i<=counter; i++) {
    bar.update(i+1);
    await api.getMeasurements(token, batch, i);
  }
  bar.stop();
} 

async function upload() {
  await deleteContens();
  const size = parseInt(process.env.SIZE);
  const batch = parseInt(process.env.BATCH);
  const env = await createStaticContens();
  const measurements = await prepareMeasurements(env, size);
  const before = time.get();
  await createMeasurements(env.token, measurements, batch);
  const after = time.get();
  console.log('batch=' + batch + ' - time=' + (after-before) + ' - free memory=' + os.freemem());
}

async function download() {
  const size = parseInt(process.env.SIZE);
  const batch = parseInt(process.env.BATCH);
  const token = await getToken();
  const before = time.get();
  await getMeasurements(token, size, batch);
  const after = time.get();
  console.log('batch=' + batch + ' - time=' + (after-before) + ' - free memory=' + os.freemem());
}

if(process.argv[2] == 'download') download();
if(process.argv[2] == 'upload') upload();
else console.log('Usage: node run.js [download/upload]');
