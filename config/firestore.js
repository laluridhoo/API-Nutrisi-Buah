const admin = require('firebase-admin');
require('dotenv').config();

const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require(path)),
  });
}

const db = admin.firestore();

module.exports = {
  db,
  admin,
  serviceAccount: null,
};
