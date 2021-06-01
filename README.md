# Measurify Cloud API Load testing tool

This is a tool to make load test of Measurify Cloud API.

DON'T USE AGAINST A PRODUCTION TENANT! IT DELETE ALL DATABASE CONTENTS!!!

It creates a tenant and some static data (thing, feature, device) and then load the API with a number of measurements. The selection of the run mode (standard HTTP post requests or streaming trhough a web socket connection) can be selected from the command line:

node run.js [post/stream]

The upload is done using a batch approach, each request (post) or each message (web socket) contains a number of measurements.

You can customize the behaviour of the tool by editing varibales.env file:

URL=https://localhost:443
VERSION=v1
TENANT=measurify-load-test
API_TOKEN=ifhidhfudshuf8
USERNAME=admin
PASSWORD=admin
SIZES=[1000]
BATCHES=[1, 10, 100]

URL is the base URL of the API; VERSION is the API version; TENENAT is the tenant used for the test (if it doesn't exist, it will be created); API_TOKEN is the Measurify token to create tenants; USERNAME and PASSWORD are credentials of the admin user of the tenant; SIZES is an array of numbers of measurements uploaded from API during the load test; BATCHES is an array of numbers for each batch.
