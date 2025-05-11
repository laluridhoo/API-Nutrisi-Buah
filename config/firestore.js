const admin = require('firebase-admin');
const fs = require('fs');
require('dotenv').config();

const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;

let serviceAccount = null;
if (path) {
  try {
    if (!fs.existsSync(path)) {
      throw new Error(`File service account tidak ditemukan di path: ${path}`);
    }
    serviceAccount = JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (err) {
    console.error('Gagal membaca service account:', err.message);
    process.exit(1);
  }
} else {
  console.error('GOOGLE_APPLICATION_CREDENTIALS tidak terdefinisi di .env');
  process.exit(1);
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
