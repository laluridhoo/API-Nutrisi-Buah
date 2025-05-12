const {
  getFruitByLabel,
  addFruitConsumption,
  getDailyNutrition,
  getMonthlyNutrition, 
  getDailyHistoryConsumptions,
  getFruitDetailsById
} = require('./handler');
const Joi = require('joi');


const routes = [
  {
    method: 'POST',
    path: '/api/fruit',
    handler: getFruitByLabel,
    options: {
      description: 'Mendapatkan informasi nutrisi buah berdasarkan label (dikirim melalui body)',
      tags: ['api', 'public']
    }
  },
  {
    method: 'POST',
    path: '/api/consumption',
    handler: addFruitConsumption,
    options: {
      description: 'Menambahkan konsumsi buah ke riwayat pengguna',
      tags: ['api', 'private']
    }
  },
  {
    method: 'GET',
    path: '/api/nutrisi-harian/{userId}',
    handler: getDailyNutrition,
    options: {
      description: 'Mendapatkan ringkasan nutrisi harian untuk seorang pengguna',
      tags: ['api', 'private'],
      notes: 'Query opsional: date (YYYY-MM-DD), default hari ini'
    }
  },
  {
    method: 'GET',
    path: '/api/nutrisi-bulanan/{userId}',
    handler: getMonthlyNutrition,
    options: {
      description: 'Mendapatkan ringkasan nutrisi bulanan untuk seorang pengguna',
      tags: ['api', 'private'],
      notes: 'Query opsional: year (YYYY) dan month (1-12), default tahun dan bulan sekarang',
      validate: {
        params: Joi.object({
          userId: Joi.string().required().description('ID pengguna')
        }),
        query: Joi.object({
          year: Joi.number().integer().min(2000).max(2100).optional().description('Tahun (YYYY)'),
          month: Joi.number().integer().min(1).max(12).optional().description('Bulan (1-12)')
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/fruit/{fruitId}',
    handler: getFruitDetailsById,
    options: {
      description: 'Mendapatkan detail nutrisi buah berdasarkan ID buah',
      tags: ['api', 'public'],
      validate: {
        params: Joi.object({
          fruitId: Joi.string().required().description('ID buah')
        })
      }
    }
  }
];

module.exports = routes;