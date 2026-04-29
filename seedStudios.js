const mongoose = require('mongoose');
const Studio = require('./models/Studio'); 
const dotenv = require('dotenv');

dotenv.config();

const studios = [
  { 
    name: "West End Vocals", 
    location: "London", 
    pricePerHour: 65, 
    description: "Elite vocal booth in Central London. Vibe: High-End Vintage.",
    hardware: "Neve 1073 Preamp, U87 Ai Microphone, Teletronix LA-2A Compressor",
    software: "Pro Tools Ultimate, Universal Audio (UAD) Complete Bundle",
    features: "Soundproof vocal booth, Butler service"
  },
  { 
    name: "The Northern Quarter Hub", 
    location: "Manchester", 
    pricePerHour: 40, 
    description: "Vibrant indie space perfect for bands. Vibe: Redwood Acoustic.",
    hardware: "AKG C414 Pair, Focusrite Red Preamp, Ribbon Mics",
    software: "Logic Pro X, Valhalla Reverb Bundle, Melodyne 5",
    features: "Real wood diffusers, Upright Piano"
  },
  { 
    name: "Mersey Beat Studio", 
    location: "Liverpool", 
    pricePerHour: 35, 
    description: "Classic analog setup with a modern twist. Vibe: Underground Elite.",
    hardware: "Warm Audio WA-8000, DBX 160A, Yamaha HS8 Monitors",
    software: "Reaper, iZotope Production Suite, Vintage Drum Samples",
    features: "Street art decor, 24/7 access"
  },
  { 
    name: "Digbeth Digital", 
    location: "Birmingham", 
    pricePerHour: 38, 
    description: "Cutting-edge electronic suite. Vibe: The Synth Sanctuary.",
    hardware: "Prophet 6, Juno-60, Modular Synth Wall, Arturia MatrixBrute",
    software: "Bitwig Studio, Kontakt 7 Collector’s Edition",
    features: "Multi-monitor setup, Foley pit"
  },
  { 
    name: "Steel City Sound", 
    location: "Sheffield", 
    pricePerHour: 30, 
    description: "Spacious live room with great reverb. Vibe: Granite Rock Room.",
    hardware: "16-channel API Console, Fully mic'ed Pearl Drum Kit",
    software: "Cubase Pro, Slate Digital All Access, SSD5 Drums",
    features: "High ceilings, Double-door sound locks"
  },
  { 
    name: "The Lanes Recording", 
    location: "Bristol", 
    pricePerHour: 42, 
    description: "Bass-heavy monitoring setup. Vibe: Bassline Bunker.",
    hardware: "Subpac M2, Genelec 8351B Monitors, Moog Subsequent 37",
    software: "Ableton Live 12 Suite, FabFilter Pro Bundle",
    features: "Isolated sub-room, 120 inch Projector screen"
  },
  { 
    name: "Quayside Audio", 
    location: "Newcastle", 
    pricePerHour: 32, 
    description: "Modern, sleek studio with views. Vibe: Neon Cloud Digital.",
    hardware: "Sony C800G Mic, Avalon VT-737sp, Apollo x8p Interface",
    software: "FL Studio 24, Autotune Pro, Serum, Omnisphere",
    features: "LED RGB custom lighting, Fast turnaround mixing"
  },
  { 
    name: "Cornish Coast Records", 
    location: "Cornwall", 
    pricePerHour: 45, 
    description: "Destination studio for ultimate creative focus.",
    hardware: "Manley Reference Gold Mic, Neve 8801 Channel Strip",
    software: "Pro Tools, Keyscape, Antares Auto-Tune Hybrid",
    features: "Complimentary refreshments, Beach view"
  },
  { 
    name: "The Oxford Suite", 
    location: "Oxford", 
    pricePerHour: 50, 
    description: "Pristine treatment for cinematic scoring.",
    hardware: "Pair of AKG C414s, Focusrite Red Preamp, Ribbon Mics",
    software: "Logic Pro X, Valhalla Reverb Bundle, Melodyne 5",
    features: "Acoustic Guitar collection, 5.1 Surround sound"
  },
  { 
    name: "Brighton Pier Productions", 
    location: "Brighton", 
    pricePerHour: 38, 
    description: "Eclectic atmosphere steps from the beach. Vibe: The Beat Factory.",
    hardware: "Akai MPC X, KRK Rokit 10s, Tube Tech CL1B",
    software: "Logic Pro, Waves Mercury Bundle, Arcade by Output",
    features: "Walk-in vocal booth, Large TV for lyrics"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/musiccollab');
    

    console.log("Wiping old studio data...");
    await Studio.deleteMany({}); 
    

    await Studio.insertMany(studios);
    
    console.log("✅ 10 UNIQUE Professional Studios added to the database!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
};

seedDB();