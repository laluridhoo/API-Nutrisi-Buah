require('dotenv').config();
const firestore = require('../config/firestore');

// Fungsi untuk menyimpan prediksi
async function storePrediction(data) {
    try {
        const docRef = firestore.collection('predictions').doc(data.id);
        await docRef.set(data);
        return data;
    } catch (error) {
        console.error('Error storing prediction:', error);
        throw new Error('Gagal menyimpan data prediksi');
    }
}

// Fungsi untuk mendapatkan prediksi berdasarkan ID
async function getPredictionById(id) {
    try {
        const docRef = firestore.collection('predictions').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return null;
        }

        return {
            id: doc.id,
            ...doc.data()
        };
    } catch (error) {
        console.error('Error getting prediction:', error);
        throw new Error('Gagal mengambil data prediksi');
    }
}

// Fungsi untuk mendapatkan semua prediksi
async function getAllPredictions(limit = 10) {
    try {
        const predictionsRef = firestore.collection('predictions');
        const snapshot = await predictionsRef
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting all predictions:', error);
        throw new Error('Gagal mengambil daftar prediksi');
    }
}

// Fungsi untuk menyimpan konsumsi nutrisi
async function storeNutritionIntake(userId, fruit, quantity, date) {
    try {
        const docRef = firestore.collection('nutritionIntake').doc();
        const data = {
            userId,
            fruit,
            quantity,
            date: date || new Date()
        };
        await docRef.set(data);
        return data;
    } catch (error) {
        console.error('Error storing nutrition intake:', error);
        throw new Error('Gagal menyimpan data konsumsi nutrisi');
    }
}

// Fungsi untuk mendapatkan konsumsi nutrisi berdasarkan rentang waktu
async function getNutritionIntake(userId, startDate, endDate) {
    try {
        const intakeRef = firestore.collection('nutritionIntake');
        const snapshot = await intakeRef
            .where('userId', '==', userId)
            .where('date', '>=', startDate)
            .where('date', '<=', endDate)
            .get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting nutrition intake:', error);
        throw new Error('Gagal mengambil data konsumsi nutrisi');
    }
}

// Export semua fungsi
module.exports = {
    storePrediction,
    getPredictionById,
    getAllPredictions,
    storeNutritionIntake,
    getNutritionIntake
};