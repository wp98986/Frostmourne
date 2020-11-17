const path = require('path');
const generateMock = require('merge-umi-mock-data');

generateMock(path.join(__dirname, '../mock'), path.join(__dirname, '../functions/mock/index.js'));
