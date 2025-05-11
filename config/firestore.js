const admin = require('firebase-admin');
const path = require('path');

// Load credentials from file
const serviceAccount = require(path.resolve('/home/nama_user/keyService/smart-nutrition-app-457602-f6d169feeb4d.json'));

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
