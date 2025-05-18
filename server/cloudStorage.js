// cloudStorage.js
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const bucketName = 'image-buah'; // Ganti dengan nama bucket kamu

const getImageUrlByFruitLabel = async (fruitLabel) => {
  if (!fruitLabel) return null;
  const fileName = `${fruitLabel}.jpg`;
  return `https://storage.googleapis.com/${bucketName}/${fileName}`;
};

module.exports = {
  getImageUrlByFruitLabel
};
