require('dotenv').config(); 
const mongoose = require('mongoose');
const Product = require('./models/Product');


const DB_URL = process.env.MONGO_URI; 

console.log("Attempting to connect using .env variable...");

mongoose.connect(DB_URL)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
    seedDB();
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

const beats = [
  { name: "Neon Lights", price: 25, genre: "Pop", image: "https://placehold.co/400?text=Pop+1", audioPreview: "/audio/beat1.mp3", description: "Bright pop vibes" },
  { name: "Sugar Rush", price: 20, genre: "Pop", image: "https://placehold.co/400?text=Pop+2", audioPreview: "/audio/beat1.mp3", description: "Sweet melodies" },
  { name: "Top Chart", price: 30, genre: " Funky Pop", image: "https://placehold.co/400?text=Pop+3", audioPreview: "/audio/funkypopbeat.mp3", description: "Radio ready" },
  { name: "Static Soul", price: 22, genre: "Grungy Pop", image: "https://placehold.co/400?text=Grunge+1", audioPreview: "/audio/beat1.mp3", description: "Gritty and raw" },
  { name: "Broken Radio", price: 22, genre: "Grungy Pop", image: "https://placehold.co/400?text=Grunge+2", audioPreview: "/audio/beat1.mp3", description: "Alternative sound" },
  { name: "Vault 808", price: 15, genre: "Trap", image: "https://placehold.co/400?text=Trap+1", audioPreview: "/audio/beat1.mp3", description: "Hard hitting drums" },
  { name: "Night Crawler", price: 15, genre: "Trap", image: "https://placehold.co/400?text=Trap+2", audioPreview: "/audio/beat1.mp3", description: "Dark trap vibes" },
  { name: "Midnight Rain", price: 20, genre: "Ballad", image: "https://placehold.co/400?text=Ballad", audioPreview: "/audio/beat1.mp3", description: "Emotional piano" },
  { name: "Dusty Road", price: 18, genre: "Country", image: "https://placehold.co/400?text=Country", audioPreview: "/audio/beat1.mp3", description: "Acoustic country" },
  { name: "Garage Dreams", price: 20, genre: "Indie", image: "https://placehold.co/400?text=Indie", audioPreview: "/audio/beat1.mp3", description: "Bedroom indie style" },
];

const seedDB = async () => {
  try {
    console.log("Clearing old products...");
    await Product.deleteMany({});
    
    console.log("Inserting 10 new beats...");
    await Product.insertMany(beats);
    
    console.log("✅ Success! Database Seeded with 10 beats.");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    console.log("Closing connection...");
    mongoose.connection.close();
    process.exit();
  }
};