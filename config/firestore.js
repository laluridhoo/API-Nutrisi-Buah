const admin = require('firebase-admin');
require('dotenv').config();

// Inisialisasi Firestore
let firestore;

if (process.env.NODE_ENV === 'development') {
    // Gunakan emulator untuk development
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
    firestore = admin.initializeApp({
        projectId: 'your-project-id',
        credential: admin.credential.applicationDefault()
    }).firestore();
} else {
    // Gunakan Firestore asli untuk production
    firestore = admin.initializeApp({
        credential: admin.credential.applicationDefault()
    }).firestore();
}

module.exports = firestore;