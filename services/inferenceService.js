// inferenceService.js - Layanan inferensi nutrisi
require('dotenv').config();

// Basis data untuk informasi nutrisi buah
const nutritionDatabase = {
    "apel": {
      "id": "apel-001",
      "name": "Apel",
      "kalori": 52,
      "protein": 0.3,
      "karbohidrat": 13.8,
      "lemak": 0.2,
      "water": 85.6,
      "energy": {
        "atwater": 3.0,
        "specific": 0.3
      },
      "nitrogen": 2.8,
      "minerals": {
        "calcium": 6,
        "iron": 0.12,
        "magnesium": 5,
        "phosphorus": 11,
        "potassium": 107,
        "sodium": 1,
        "zinc": 0.04,
        "copper": 0.027,
        "manganese": 0.035
      }
    },
    "pisang": {
      "id": "pisang-001",
      "name": "Pisang",
      "kalori": 89,
      "protein": 1.1,
      "karbohidrat": 22.8,
      "lemak": 0.3,
      "water": 74.9,
      "energy": {
        "atwater": 3.9,
        "specific": 0.4
      },
      "nitrogen": 2.8,
      "minerals": {
        "calcium": 5,
        "iron": 0.26,
        "magnesium": 27,
        "phosphorus": 22,
        "potassium": 358,
        "sodium": 1,
        "zinc": 0.15,
        "copper": 0.078,
        "manganese": 0.27
      }
    },
    "wortel": {
      "id": "wortel-001",
      "name": "Wortel",
      "kalori": 41,
      "protein": 0.9,
      "karbohidrat": 9.6,
      "lemak": 0.2,
      "water": 88,
      "energy": {
        "atwater": 3.0,
        "specific": 0.3
      },
      "nitrogen": 2.8,
      "minerals": {
        "calcium": 33,
        "iron": 0.3,
        "magnesium": 12,
        "phosphorus": 35,
        "potassium": 320,
        "sodium": 69,
        "zinc": 0.2,
        "copper": 0.02,
        "manganese": 0.14
      }
    },
    "jeruk": {
    "id": "jeruk-001",
    "name": "Jeruk",
    "kalori": 47,
    "protein": 0.9,
    "karbohidrat": 11.8,
    "lemak": 0.1,
    "water": 86.8,
    "energy": {
      "atwater": 2.0,
      "specific": 0.2
    },
    "nitrogen": 2.8,
    "minerals": {
      "calcium": 40,
      "iron": 0.1,
      "magnesium": 10,
      "phosphorus": 14,
      "potassium": 181,
      "sodium": 0,
      "zinc": 0.07,
      "copper": 0.04,
      "manganese": 0.03
    }
  },
  "buah naga": {
    "id": "buah-naga-001",
    "name": "Buah Naga",
    "kalori": 50,
    "protein": 1.1,
    "karbohidrat": 11,
    "lemak": 0.4,
    "water": 84,
    "energy": {
      "atwater": 2.1,
      "specific": 0.2
    },
    "nitrogen": 2.8,
    "minerals": {
      "calcium": 18,
      "iron": 0.7,
      "magnesium": 10,
      "phosphorus": 36,
      "potassium": 268,
      "sodium": 1,
      "zinc": 0.1,
      "copper": 0.08,
      "manganese": 0.1
    }
  },
  "salak": {
    "id": "salak-001",
    "name": "Salak",
    "kalori": 82,
    "protein": 0.6,
    "karbohidrat": 22.3,
    "lemak": 0.4,
    "water": 75,
    "energy": {
      "atwater": 3.5,
      "specific": 0.4
    },
    "nitrogen": 2.8,
    "minerals": {
      "calcium": 38,
      "iron": 2.8,
      "magnesium": 12,
      "phosphorus": 18,
      "potassium": 256,
      "sodium": 4,
      "zinc": 0.1,
      "copper": 0.08,
      "manganese": 0.1
    }
  },
  "timun": {
    "id": "timun-001",
    "name": "Timun",
    "kalori": 15,
    "protein": 0.7,
    "karbohidrat": 3.6,
    "lemak": 0.1,
    "water": 95.2,
    "energy": {
      "atwater": 1.3,
      "specific": 0.1
    },
    "nitrogen": 2.8,
    "minerals": {
      "calcium": 16,
      "iron": 0.3,
      "magnesium": 13,
      "phosphorus": 24,
      "potassium": 147,
      "sodium": 2,
      "zinc": 0.2,
      "copper": 0.03,
      "manganese": 0.08
    }
  },
  "tomat": {
    "id": "tomat-001",
    "name": "Tomat",
    "kalori": 18,
    "protein": 0.9,
    "karbohidrat": 3.9,
    "lemak": 0.2,
    "water": 94.5,
    "energy": {
      "atwater": 1.6,
      "specific": 0.2
    },
    "nitrogen": 2.8,
    "minerals": {
      "calcium": 10,
      "iron": 0.27,
      "magnesium": 11,
      "phosphorus": 24,
      "potassium": 237,
      "sodium": 5,
      "zinc": 0.17,
      "copper": 0.06,
      "manganese": 0.11
    }
  },
  "alpukat": {
    "id": "alpukat-001",
    "name": "Alpukat",
    "kalori": 160,
    "protein": 2,
    "karbohidrat": 8.5,
    "lemak": 14.7,
    "water": 73.2,
    "energy": {
      "atwater": 6.7,
      "specific": 0.7
    },
    "nitrogen": 2.8,
    "minerals": {
      "calcium": 12,
      "iron": 0.55,
      "magnesium": 29,
      "phosphorus": 52,
      "potassium": 485,
      "sodium": 7,
      "zinc": 0.64,
      "copper": 0.19,
      "manganese": 0.14
    }
  },
  "pear": {
    "id": "pear-001",
    "name": "Pear",
    "kalori": 57,
    "protein": 0.4,
    "karbohidrat": 15.2,
    "lemak": 0.1,
    "water": 84,
    "energy": {
      "atwater": 2.4,
      "specific": 0.3
    },
    "nitrogen": 2.8,
    "minerals": {
      "calcium": 9,
      "iron": 0.2,
      "magnesium": 7,
      "phosphorus": 12,
      "potassium": 119,
      "sodium": 1,
      "zinc": 0.1,
      "copper": 0.08,
      "manganese": 0.05
    }
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
