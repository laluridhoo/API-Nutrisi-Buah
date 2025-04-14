// src/config/storage.js
const {Storage} = require('@google-cloud/storage');
require('dotenv').config();

const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});
const bucketName = process.env.BUCKET_NAME || 'hasil-upload';
const bucket = storage.bucket(process.env.BUCKET_NAME);

module.exports = { bucket };