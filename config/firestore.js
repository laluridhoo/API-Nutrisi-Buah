// firestore.js
const admin = require('firebase-admin');

// Inisialisasi Firebase Admin dengan credential dari env variable
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'smart-nutrition-app-457602'
  });
}

const db = admin.firestore();

module.exports = {
  db,
  admin
};
