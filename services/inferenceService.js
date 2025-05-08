// inferenceService.js - Layanan inferensi nutrisi
require('dotenv').config();

// Basis data untuk informasi nutrisi buah
const nutritionDatabase = {
  'apple': {
    id: "apple-001",
    name: "Apple",
    kalori: 582,
    protein: 58,
    karbohidrat: 26,
    lemak: 28,
    water: 25,
    energy: {
      atwater: 4.4,
      specific: 0.5
    },
    nitrogen: 8.4,
    minerals: {
      calcium: 195,
      iron: 195,
      magnesium: 195,
      phosphorus: 195,
      potassium: 195,
      sodium: 195,
      zinc: 195,
      copper: 195,
      manganese: 195
    },
    vitamins: {}
  },
  'banana': {
    id: "banana-001",
    name: "Banana",
    kalori: 105,
    protein: 1.3,
    karbohidrat: 27,
    lemak: 0.4,
    water: 74,
    energy: {
      atwater: 3.8,
      specific: 0.4
    },
    nitrogen: 5.2,
    minerals: {
      calcium: 5,
      iron: 0.3,
      magnesium: 32,
      phosphorus: 26,
      potassium: 422,
      sodium: 1,
      zinc: 0.2,
      copper: 0.1,
      manganese: 0.3
    },
    vitamins: {}
  },
  'orange': {
    id: "orange-001",
    name: "Orange",
    kalori: 62,
    protein: 1.2,
    karbohidrat: 15.4,
    lemak: 0.2,
    water: 86,
    energy: {
      atwater: 3.2,
      specific: 0.3
    },
    nitrogen: 4.8,
    minerals: {
      calcium: 40,
      iron: 0.1,
      magnesium: 10,
      phosphorus: 14,
      potassium: 181,
      sodium: 0,
      zinc: 0.1,
      copper: 0.04,
      manganese: 0.03
    },
    vitamins: {}
  },
  'carrot': {
    id: "carrot-001",
    name: "Carrot",
    kalori: 41,
    protein: 0.9,
    karbohidrat: 9.6,
    lemak: 0.2,
    water: 88,
    energy: {
      atwater: 3.0,
      specific: 0.3
    },
    nitrogen: 2.8,
    minerals: {
      calcium: 33,
      iron: 0.3,
      magnesium: 12,
      phosphorus: 35,
      potassium: 320,
      sodium: 69,
      zinc: 0.2,
      copper: 0.02,
      manganese: 0.14
    },
    vitamins: {}
  }
};

/**
 * Mengambil informasi nutrisi berdasarkan label buah
 * @param {string} label - Label buah (misalnya: 'apple', 'banana')
 * @returns {Object|null} - Informasi nutrisi buah atau null jika tidak ditemukan
 */
function getNutritionByLabel(label) {
  if (!label) return null;
  return nutritionDatabase[label.toLowerCase()] || null;
}

/**
 * Mengambil informasi buah berdasarkan ID
 * @param {string} id - ID buah
 * @returns {Object|null} - Informasi buah atau null jika tidak ditemukan
 */
function getFruitById(id) {
  if (!id) return null;
  return Object.values(nutritionDatabase).find(fruit => fruit.id === id) || null;
}

/**
 * Mensimulasikan pengenalan buah dari gambar
 * Ini akan diganti dengan model ML yang sesungguhnya di produksi
 * @param {Buffer|string} imageData - Data gambar untuk pengenalan
 * @returns {Object} - Hasil pengenalan
 */
function recognizeFruit(imageData) {
  // Dalam aplikasi nyata, ini akan menggunakan ML untuk mendeteksi buah
  // Untuk sekarang, kita hanya mensimulasikan dengan memilih buah secara acak
  const fruits = Object.keys(nutritionDatabase);
  const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
  
  return {
    success: true,
    label: randomFruit,
    confidence: Math.random() * 0.3 + 0.7 // Nilai kepercayaan acak antara 0.7 hingga 1.0
  };
}

module.exports = {
  getNutritionByLabel,
  getFruitById,
  recognizeFruit
};
