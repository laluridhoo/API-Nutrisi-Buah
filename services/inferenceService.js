require('dotenv').config();
const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat()
            .div(tf.scalar(255));
                console.log('Tensor shape:', tensor.shape);
                 console.log('Tensor summary:', tensor.toString());
        const classes = [
            'apple red','apple golden', 'cabbage white','apple granny smith','apple crimson snow',
            'carrot','apple braeburn','apple red delicious','apple pink lady','zucchini dark',
            'apple red yellow', 'cucumber', 'eggplant long', 'pear','apple hit'
        ];

        const nutritionInfo = {
           'carrot': { calories: 41, carbon: 9.6, protein: 0.9, fat: 0.2 },
            'apple braeburn': { calories: 57, carbon: 13.8, protein: 0.3, fat: 0.1 },
            'apple red delicious': { calories: 59, carbon: 14.1, protein: 0.2, fat: 0.1 },
            'apple pink lady': { calories: 57, carbon: 15.2, protein: 0.4, fat: 0.1 },
            'zucchini dark': { calories: 17, carbon: 3.1, protein: 1.2, fat: 0.3 },
            'apple red yellow': { calories: 52, carbon: 14, protein: 0.3, fat: 0.2 }, // estimasi rata-rata apel
            'cucumber': { calories: 15, carbon: 3.6, protein: 0.7, fat: 0.1 },
            'eggplant long': { calories: 25, carbon: 5.9, protein: 1.0, fat: 0.2 },
            'pear': { calories: 57, carbon: 15.2, protein: 0.4, fat: 0.1 },
            'apple hit': { calories: 52, carbon: 14, protein: 0.3, fat: 0.2 }, // estimasi rata-rata apel
            'apple red': { calories: 52, carbon: 14, protein: 0.3, fat: 0.2 }, // estimasi rata-rata apel
            'apple golden': { calories: 52, carbon: 13.6, protein: 0.3, fat: 0.2 },
            'cabbage white': { calories: 25, carbon: 5.8, protein: 1.3, fat: 0.1 },
            'apple granny smith': { calories: 58, carbon: 13.6, protein: 0.4, fat: 0.2 },
            'apple crimson snow': { calories: 52, carbon: 14, protein: 0.3, fat: 0.2 } // estimasi rata-rata apel
        };
        
        const fruitNames = {
            'carrot': 'Carrot' ,
            'apple braeburn': 'Apple Braeburn',
            'apple red delicious': 'Apple Red Delicious',
            'apple pink lady': 'Apple Pink Lady',
            'zucchini dark': 'Zucchini Dark',
            'apple red yellow':  'Apple Red Yellow',
            'cucumber': 'Cucumber',
            'eggplant long': 'Eggplant Long',
            'pear': 'Pear',
            'apple hit':  'Apple Hit',
            'apple red': 'Apple Red',
            'apple golden': 'Apple Golden',
            'cabbage white': 'Cabbage White',
            'apple granny smith': 'Apple Granny Smith',
            'apple crimson snow': 'Apple Crimson Snow',
        };
        

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        const classResult = tf.argMax(prediction, 1).dataSync()[0];
        const label = classes[classResult];

        if (!nutritionInfo[label]) {
            throw new InputError(`Data nutrisi untuk ${label} tidak tersedia.`);
        }

        const { calories, carbon, protein, fat } = nutritionInfo[label];

        tensor.dispose();
        prediction.dispose();

        return {
            confidenceScore,
            label,
            name: fruitNames[label] || label,
            calories,
            carbon,
            protein,
            fat,
        };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`);
    }
}

module.exports = predictClassification;
