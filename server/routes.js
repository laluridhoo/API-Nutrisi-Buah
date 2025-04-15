const { 
    postPredictHandler, 
    getPredictionHandler, 
    getAllPredictionsHandler 
} = require('./handler');
const Joi = require('@hapi/joi');
const { storeNutritionIntake, getNutritionIntake } = require('../services/firestoreService');

const routes = [
    {
        path: '/predict',
        method: 'POST',
        handler: postPredictHandler,
        options: {
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                multipart: true,
                maxBytes: 10 * 1024 * 1024, // 10MB
            },
            validate: {
                payload: Joi.object({
                    image: Joi.any()
                        .meta({ swaggerType: 'file' })
                        .required()
                        .description('Gambar yang akan diprediksi')
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/predictions/{id}',
        handler: getPredictionHandler,
        options: {
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/predictions',
        handler: getAllPredictionsHandler,
        options: {
            validate: {
                query: Joi.object({
                    limit: Joi.number().min(1).max(100).default(10)
                })
            }
        }
    },
    {
        path: '/nutrition',
        method: 'POST',
        handler: async (req, res) => {
            const { userId, fruit, quantity, date } = req.body;
            try {
                const data = await storeNutritionIntake(userId, fruit, quantity, date);
                res.status(201).json(data);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
        options: {
            validate: {
                payload: Joi.object({
                    userId: Joi.string().required(),
                    fruit: Joi.string().required(),
                    quantity: Joi.number().required(),
                    date: Joi.date().optional()
                })
            }
        }
    },
    {
        path: '/nutrition',
        method: 'GET',
        handler: async (req, res) => {
            const { userId, startDate, endDate } = req.query;
            try {
                const data = await getNutritionIntake(userId, new Date(startDate), new Date(endDate));
                res.status(200).json(data);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
        options: {
            validate: {
                query: Joi.object({
                    userId: Joi.string().required(),
                    startDate: Joi.date().required(),
                    endDate: Joi.date().required()
                })
            }
        }
    }
];

module.exports = routes;