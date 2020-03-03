# Atmosphere Cloud API Load testing tool

This is a tool to make load test of Atmophere Cloud API.

DON'T USE AGAINST A PRODUCTION API! IT DELETE ALL DATABASE CONTENTS!!!

It creates an envirnonment (thing, feature, device) and then load the API with a number of measurements or donwload measurements from API. The selection of the run mode (upload/donwload) cna be selected from the command line:

    node run.js [download/upload]

The upload/download is done in using a batch approach, each POST/GET contains a number of measurements.

Yoy can customize the behaviour of the tool by editing varibales.env file:

    URL=https://localhost:443
    VERSION=v1
    USERNAME=admin
    PASSWORD=admin
    SIZE=1000
    BATCH=100

URL is the base URL of the API; VERSION is the API version; USERNAME and PASSWORD are credentials of a valid admin user for the API; SIZE is the number of measurements uploaded/downloaded from API during the load test; BATCH the number of measurements for each POST/GET
