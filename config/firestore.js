const admin = require('firebase-admin');
const path = require('path');

// Load credentials from file
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

module.exports = {
  db,
  admin,
  serviceAccount, // jika ingin akses info credential
};
