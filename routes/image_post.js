const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Store original files with extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .jpg, .png
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post('/topython', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputPath = req.file.path;
    const convertedPath = `${inputPath}.jpg`; // always convert to jpg

    // ✅ Re-encode and ensure it's a clean .jpg
    await sharp(inputPath)
      .jpeg({ quality: 90 })
      .toFile(convertedPath);

    const outputFileName = `${Date.now()}_result.jpg`;
    const outputPath = path.join('result_image', outputFileName);

    // Format paths for Python on Windows
    const safeInputPath = convertedPath.replace(/\\/g, '/');
    const safeOutputPath = outputPath.replace(/\\/g, '/');

    // 🔁 Run detection using Python
    exec(`python model.py "${safeInputPath}" "${safeOutputPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Detection Error:', stderr);
        return res.status(500).json({ error: 'Detection failed' });
      }

      res.json({ image: `/results/${outputFileName}` });
    });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
