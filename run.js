
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require('dotenv').config({ path: 'variables.env' });

const url = process.env.URL;
const version = process.env.VERSION;
const tenant = process.env.TENANT;
const api_token = process.env.API_TOKEN;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

const sizes = JSON.parse(process.env.SIZES);
const batches = JSON.parse(process.env.BATCHES);

const Measurify = require('./measurify.js');
const progress = require('cli-progress');

const measurify = new Measurify(url, version, tenant, api_token, username, password);

async function deleteContens() { await measurify.drop(); }

async function createStaticContens() {
  const thing = await measurify.postThing('test-thing-1');
  const item01 = { name: 'item-1', unit: 'unit-1', type: 'number', dimension: '0' };
  const item02 = { name: 'item-2', unit: 'unit-2', type: 'number', dimension: '0' };
  const item03 = { name: 'item-3', unit: 'unit-3', type: 'number', dimension: '0' };
  const feature = await measurify.postFeature('feature-1', [item01, item02, item03]);
  const device = await measurify.postDevice('device-1', [feature] );
  return { thing:thing, feature: feature, device:device } 
} 

async function prepareMeasurements(env, size) {
  const measurements = [];
  for(let i=0; i<size; i++) { measurements.push({thing: env.thing._id, device: env.device._id, feature: env.feature._id, samples: [{ values: [10.2, 4.3, 2.7] }]}) };
  return measurements;
} 

async function createMeasurements(measurements, batch, mode) {
  const size = Math.floor(measurements.length / batch);
  const bar = new progress.SingleBar({}, progress.Presets.shades_classic);
  bar.start(size, 0);
  for(let i=0; i<size; i++) {
    bar.update(i+1);
    data = measurements.slice(i*batch, i*batch+batch);
    if (mode == 'post') await measurify.postMeasurements(data);
    else if (mode == 'stream') await measurify.streamMeasurements(data);
  }
  bar.stop();
} 


async function test(mode) {
  await measurify.init();
  const results = [];
  let count = 1;
  console.log('');
  let number = sizes.length * batches.length;
  for (const size of sizes) {
    for (const batch of batches) {
      await deleteContens();
      const env = await createStaticContens();
      const measurements = await prepareMeasurements(env, size);
      console.log('Test ' + count + ' of ' + number + ' (' + 'Total_size=' + size + ' - Batch_size=' + batch + ')' );
      const before = (new Date).getTime();
      await createMeasurements(measurements, batch, mode);
      const after = (new Date).getTime();
      const time = (after - before)/1000;
      count++;
      results.push({ test: size + ' by ' + batch, time: time });
      console.log('Time=' + time + ' sec');
      console.log('');
    }
  }
  console.log(results);
}

if(!['post', 'stream'].includes(process.argv[2])) { console.log('Usage: node run.js [post/stream]'); return; }  
test(process.argv[2]);
