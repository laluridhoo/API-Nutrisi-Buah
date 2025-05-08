const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

module.exports = {
  db,
  admin,
  serviceAccount: null, // kosongkan agar tidak error saat akses
};
