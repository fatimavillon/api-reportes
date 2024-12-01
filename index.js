const express = require('express');
const serverless = require('serverless-http');
const reportRoutes = require('./routes/report_routes');

const app = express();
app.use(express.json());
app.use('/reports', reportRoutes);

module.exports.handler = serverless(app);
