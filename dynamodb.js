'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
let options = {};
console.log('loading client');
const client = new AWS.DynamoDB.DocumentClient(options);

module.exports = client;