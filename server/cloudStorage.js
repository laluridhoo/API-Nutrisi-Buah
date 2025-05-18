// cloudStorage.js
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const bucketName = 'image-buah';

const getImageUrlByFruitLabel = async (fruitLabel) => {
  if (!fruitLabel) return null;
  const possibleExt = ['jpg', 'jpeg', 'png', 'webp'];
  const bucket = storage.bucket(bucketName);

  for (const ext of possibleExt) {
    const fileName = `${fruitLabel}.${ext}`;
    const file = bucket.file(fileName);
    const [exists] = await file.exists();
    if (exists) {
      return `https://storage.googleapis.com/${bucketName}/${fileName}`;
    }
  }
  return null; // Jika tidak ditemukan file dengan ekstensi apapun
};

module.exports = {
  getImageUrlByFruitLabel
};
