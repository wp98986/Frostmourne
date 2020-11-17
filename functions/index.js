// [START functionsimport]
const functions = require('firebase-functions');
const express = require('express');

const app = express();

const matchMock = require('./matchMock');

app.use(matchMock);

exports.api = functions.https.onRequest(app);
