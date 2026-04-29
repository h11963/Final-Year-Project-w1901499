const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();
const app = express();

//  Middleware 
app.use(cors());
app.use(express.json());



const publicDir = path.join(__dirname, '../frontend/public');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    const subFolder = file.fieldname === 'imageFile' ? 'images' : 'audio';
    const finalPath = path.join(publicDir, subFolder);


    if (!fs.existsSync(finalPath)) {
      fs.mkdirSync(finalPath, { recursive: true });
    }
    cb(null, finalPath);
  },
  filename: (req, file, cb) => {

    const cleanName = file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
    cb(null, Date.now() + '-' + cleanName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 } 
});


app.set('upload', upload); 



app.use('/audio', express.static(path.join(publicDir, 'audio'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Content-Disposition', 'attachment');
  }
}));

app.use('/images', express.static(path.join(publicDir, 'images')));

// --- 4. Load Route Files ---
const authRoutes = require('./routes/auth');
const studioRoutes = require('./routes/studios');
const bookingRoutes = require('./routes/bookings');
const listingRoutes = require('./routes/listings');
const productRoutes = require('./routes/products');
const paymentRoutes = require('./routes/payment');
const collabRoutes = require('./routes/collabs');

//  Connect the Routes 
app.use('/api/auth', authRoutes);
app.use('/api/studios', studioRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/collabs', collabRoutes);

//  MongoDB Connection 
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/musiccollab')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5005; 
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


app.get('/download-file', (req, res) => {
  const fileName = req.query.file; 
  const filePath = path.join(__dirname, '../frontend/public/audio', fileName);

  res.download(filePath, (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(404).send("File not found");
    }
  });
});