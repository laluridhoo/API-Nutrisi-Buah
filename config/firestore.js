// firestore.js
const admin = require('firebase-admin');
const path = require('path');

// Gunakan file service account
const serviceAccount = require(path.resolve(__dirname, '/home/nama_user/keyService/smart-nutrition-app-457602-8a5427edbe99.json'));

// Cegah inisialisasi ganda (penting saat di-deploy atau testing)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'smart-nutrition-app-457602'
  });
}

const db = admin.firestore();

module.exports = {
  db,
  admin,
  serviceAccount, // kalau di handler butuh Timestamp misalnya
};
