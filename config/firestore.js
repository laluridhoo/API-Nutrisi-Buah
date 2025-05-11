const admin = require('firebase-admin');
const fs = require('fs');
require('dotenv').config();

const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;

let serviceAccount = null;
if (path) {
  serviceAccount = JSON.parse(fs.readFileSync(path, 'utf8'));
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

module.exports = {
  db,
  admin,
  serviceAccount,
};
