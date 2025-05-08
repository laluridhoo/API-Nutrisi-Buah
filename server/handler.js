// Handler.js - API Smart Nutrition
const { db, admin } = require('../config/firestore');
const { v4: uuidv4 } = require('uuid');
const inferenceService = require('../services/inferenceService');

// Log informasi dari environment & Firebase Admin SDK
console.log('Project ID:', process.env.GOOGLE_CLOUD_PROJECT || 'ID tidak ditemukan');
console.log('Firebase initialized:', admin.apps.length > 0);

// 1. Mendapatkan informasi nutrisi buah berdasarkan label
const getFruitByLabel = async (req, h) => {
  try {
    const { label } = req.payload; // Mengambil label dari request body

    if (!label) {
      return h.response({
        success: false,
        message: 'Label buah wajib diisi'
      }).code(400);
    }

    // Mencari informasi buah menggunakan inferenceService
    const fruitInfo = inferenceService.getNutritionByLabel(label);

    if (!fruitInfo) {
      return h.response({
        success: false,
        message: `Buah dengan label '${label}' tidak ditemukan dan pastikan anda menscan buah bukan benda`
      }).code(404);
    }

    // Mengembalikan informasi buah
    return h.response({
      success: true,
      data: fruitInfo
    }).code(200);
  } catch (error) {
    console.error('Kesalahan saat mengambil buah berdasarkan label:', error);
    return h.response({
      success: false,
      message: 'Terjadi kesalahan pada server'
    }).code(500);
  }
};

// 2. Menambahkan konsumsi buah ke riwayat pengguna
const addFruitConsumption = async (req, h) => {
  try {
    const { userId, fruitLabel, quantity = 1 } = req.payload;

    if (!userId || !fruitLabel) {
      return h.response({
        success: false,
        message: 'User ID dan label buah wajib diisi'
      }).code(400);
    }

    // Mencari informasi buah menggunakan inferenceService
    const fruitInfo = inferenceService.getNutritionByLabel(fruitLabel);

    if (!fruitInfo) {
      return h.response({
        success: false,
        message: `Buah dengan label '${fruitLabel}' tidak ditemukan`
      }).code(404);
    }

    // Membuat data konsumsi
    const timestamp = admin.firestore.Timestamp.now();
    const date = new Date(timestamp.toDate());
    const dateString = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const consumptionRecord = {
      id: uuidv4(),
      userId,
      fruitId: fruitInfo.id,
      fruitName: fruitInfo.name,
      fruitLabel,
      quantity,
      kalori: fruitInfo.kalori * quantity,
      protein: fruitInfo.protein * quantity,
      karbohidrat: fruitInfo.karbohidrat * quantity,
      lemak: fruitInfo.lemak * quantity,
      timestamp,
      date: dateString,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };

    // Menambahkan ke Firestore
    await db.collection('consumptions').doc(consumptionRecord.id).set(consumptionRecord);

    return h.response({
      success: true,
      message: 'Data konsumsi berhasil ditambahkan',
      data: consumptionRecord
    }).code(201);
  } catch (error) {
    console.error('Kesalahan saat menambahkan konsumsi buah:', error);
    return h.response({
      success: false,
      message: 'Terjadi kesalahan pada server saat menambahkan konsumsi'
    }).code(500);
  }
};

// 3. Mendapatkan ringkasan nutrisi harian
const getDailyNutrition = async (req, h) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;

    if (!userId || userId === 'null' || userId.trim() === '') {
      return h.response({
        success: false,
        message: 'User ID wajib diisi'
      }).code(400);
    }

    // Default ke hari ini jika tanggal tidak diberikan
    const queryDate = date || new Date().toISOString().split('T')[0];

    // Query konsumsi untuk tanggal tertentu
    const consumptionsRef = db.collection('consumptions');
    const snapshot = await consumptionsRef
      .where('userId', '==', userId)
      .where('date', '==', queryDate)
      .get();

    if (snapshot.empty) {
      return h.response({
        success: true,
        message: 'Tidak ada data konsumsi pada tanggal tersebut atau hari ini',
        data: {
          date: queryDate,
          totalKalori: 0,
          totalProtein: 0,
          totalKarbohidrat: 0,
          totalLemak: 0,
          items: []
        }
      }).code(200);
    }

    // Menghitung total harian
    let totalKalori = 0;
    let totalProtein = 0;
    let totalKarbohidrat = 0;
    let totalLemak = 0;
    const items = [];

    snapshot.forEach(doc => {
      const consumption = doc.data();
      totalKalori += consumption.kalori;
      totalProtein += consumption.protein;
      totalKarbohidrat += consumption.karbohidrat;
      totalLemak += consumption.lemak;

      items.push({
        id: consumption.id,
        fruitId: consumption.fruitId,
        fruitName: consumption.fruitName,
        quantity: consumption.quantity,
        kalori: consumption.kalori,
        timestamp: consumption.timestamp.toDate()
      });
    });

    // Membulatkan hasil ke 2 angka di belakang koma
    return h.response({
      success: true,
      data: {
        date: queryDate,
        totalKalori: parseFloat(totalKalori.toFixed(2)),
        totalProtein: parseFloat(totalProtein.toFixed(2)),
        totalKarbohidrat: parseFloat(totalKarbohidrat.toFixed(2)),
        totalLemak: parseFloat(totalLemak.toFixed(2)),
        items
      }
    }).code(200);
  } catch (error) {
    console.error('Kesalahan saat mengambil nutrisi harian:', error);
    return h.response({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil nutrisi harian'
    }).code(500);
  }
};

// 4. Mendapatkan ringkasan nutrisi bulanan
const getMonthlyNutrition = async (req, h) => {
  try {
    const { userId } = req.params;
    const { year, month } = req.query;

    if (!userId || userId === 'null' || userId.trim() === '') {
      return h.response({
        success: false,
        message: 'User ID wajib diisi'
      }).code(400);
    }

    // Default ke tahun dan bulan saat ini jika tidak diberikan
    const queryYear = year || new Date().getFullYear();
    const queryMonth = month || new Date().getMonth() + 1;

    // Query konsumsi untuk bulan tertentu
    const consumptionsRef = db.collection('consumptions');
    const snapshot = await consumptionsRef
      .where('userId', '==', userId)
      .where('year', '==', parseInt(queryYear))
      .where('month', '==', parseInt(queryMonth))
      .get();

    if (snapshot.empty) {
      return h.response({
        success: true,
        message: 'Tidak ada data konsumsi pada bulan tersebut',
        data: {
          year: queryYear,
          month: queryMonth,
          totalKalori: 0,
          totalProtein: 0,
          totalKarbohidrat: 0,
          totalLemak: 0,
          dailySummaries: {}
        }
      }).code(200);
    }

    // Menghitung total bulanan dan ringkasan harian
    let totalKalori = 0;
    let totalProtein = 0;
    let totalKarbohidrat = 0;
    let totalLemak = 0;
    const dailySummaries = {};

    snapshot.forEach(doc => {
      const consumption = doc.data();
      totalKalori += consumption.kalori;
      totalProtein += consumption.protein;
      totalKarbohidrat += consumption.karbohidrat;
      totalLemak += consumption.lemak;

      const day = consumption.day;
      if (!dailySummaries[day]) {
        dailySummaries[day] = {
          day,
          totalKalori: 0,
          totalProtein: 0,
          totalKarbohidrat: 0,
          totalLemak: 0,
          items: []
        };
      }

      dailySummaries[day].totalKalori += consumption.kalori;
      dailySummaries[day].totalProtein += consumption.protein;
      dailySummaries[day].totalKarbohidrat += consumption.karbohidrat;
      dailySummaries[day].totalLemak += consumption.lemak;
      dailySummaries[day].items.push({
        id: consumption.id,
        fruitId: consumption.fruitId,
        fruitName: consumption.fruitName,
        quantity: consumption.quantity,
        kalori: consumption.kalori,
        timestamp: consumption.timestamp.toDate()
      });
    });

    return h.response({
      success: true,
      data: {
        year: queryYear,
        month: queryMonth,
        totalKalori,
        totalProtein,
        totalKarbohidrat,
        totalLemak,
        dailySummaries
      }
    }).code(200);
  } catch (error) {
    console.error('Kesalahan saat mengambil nutrisi bulanan:', error);
    return h.response({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil nutrisi bulanan'
    }).code(500);
  }
};

// 5. Mendapatkan riwayat scan harian
const getDailyHistoryConsumptions= async (req, h) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;

    if (!userId || userId === 'null' || userId.trim() === '') {
      return h.response({
        success: false,
        message: 'User ID wajib diisi'
      }).code(400);
    }

    // Default ke hari ini jika tanggal tidak diberikan
    const queryDate = date || new Date().toISOString().split('T')[0];

    // Query scan untuk tanggal tertentu
    const scansRef = db.collection('consumptions'); // Pastikan koleksi 'consumptions' ada di Firestore
    const snapshot = await scansRef
      .where('userId', '==', userId)
      .where('date', '==', queryDate)
      .get();

    if (snapshot.empty) {
      return h.response({
        success: true,
        message: 'Tidak ada data scan pada tanggal tersebut',
        data: []
      }).code(200);
    }

    // Deklarasikan scanHistory sebelum digunakan
    const scanHistory = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      scanHistory.push({
        fruitLabel: data.fruitLabel,
        date: data.date
      });
    });

    return h.response({
      success: true,
      data: scanHistory
    }).code(200);
  } catch (error) {
    console.error('Kesalahan saat mengambil riwayat scan harian:', error);
    return h.response({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil riwayat scan harian'
    }).code(500);
  }
};

// 6. Mendapatkan detail nutrisi buah berdasarkan ID buah
const getFruitDetailsById = async (req, h) => {
  try {
    const { fruitId } = req.params;

    if (!fruitId || fruitId.trim() === '') {
      return h.response({
        success: false,
        message: 'ID buah wajib diisi'
      }).code(400);
    }

    // Query Firestore untuk mendapatkan detail buah berdasarkan ID
    const fruitDoc = await db.collection('consumptions').doc(fruitId).get();

    if (!fruitDoc.exists) {
      return h.response({
        success: false,
        message: `Buah dengan ID '${fruitId}' tidak ditemukan`
      }).code(404);
    }

    // Mengembalikan data buah
    return h.response({
      success: true,
      data: fruitDoc.data()
    }).code(200);
  } catch (error) {
    console.error('Kesalahan saat mengambil detail nutrisi buah:', error);
    return h.response({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil detail nutrisi buah'
    }).code(500);
  }
};

module.exports = {
  getFruitByLabel,
  addFruitConsumption,
  getDailyNutrition,
  getMonthlyNutrition,
  getDailyHistoryConsumptions,
  getFruitDetailsById 
};
