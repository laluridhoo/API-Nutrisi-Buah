// cloudStorage.js
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const bucketName = 'image-buah'; // Ganti dengan nama bucket kamu

const getImageUrlByFruitLabel = async (fruitLabel) => {
  const fileName = `${fruitLabel}.jpg`; // Atau .png sesuai di bucket
  const file = storage.bucket(bucketName).file(fileName);

  try {
    // Gunakan signed URL valid selama 1 hari
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 24 * 60 * 60 * 1000 
    });
    return url;
  } catch (err) {
    console.error(`Gagal mengambil URL gambar untuk ${fruitLabel}:`, err);
    return null;
  }
};

module.exports = {
  getImageUrlByFruitLabel
};
