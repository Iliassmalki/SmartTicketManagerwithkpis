'use strict';



import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import { v4 as uuidv4 } from 'uuid';



import db from './models/index.js';
const { sequelize } = db;

//mock data
const baseLat = 33.56121911654841;
const baseLng = -7.626197677869365;

// Helper to generate a random number in a range
function randomOffset(maxOffset) {
  return (Math.random() - 0.5) * 2 * maxOffset; // ±maxOffset
}

export async function generateMockEvents(count = 10) {
  const events = [];

  for (let i = 0; i < count; i++) {
    const lat = baseLat + randomOffset(0.01); // ~1 km variation
    const lng = baseLng + randomOffset(0.01);

    const daysAhead = Math.floor(Math.random() * 7) + 1; // 1-7 days from now
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + daysAhead);

    events.push({
      userId: "db3a6a49-8b36-47ac-a5b7-edfc08592084",
      id: uuidv4(),
      name: `Événement Test ${i + 1}`,
      price: Math.floor(Math.random() * 200) + 50, // 50-250
      description: `Description de l'événement ${i + 1}`,
      picture: `https://picsum.photos/seed/event${i + 1}/400/300`,
      location: 'Casablanca',
      latitude: lat,
      longitude: lng,
      startDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: 'SPORT'
    });
  }

  try {
    await db.Event.bulkCreate(events);
    console.log(`${count} mock events created successfully!`);
  } catch (err) {
    console.error("Error creating mock events:", err);
  }
}



// Example usage
 //generateMockEvents(5);
await sequelize.sync({ alter: true });

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        console.log('🔍 Checking database connection...');

        // Test DB connection
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');

     app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`➡️  Local:   http://localhost:${PORT}`);
    console.log(`➡️  Network: http://192.168.1.104:${PORT}`);
});


    } catch (error) {
        console.error('❌ Unable to connect to the database:');
        console.error(error.message);
        process.exit(1); // stop the server
    }
}

// Start the app
startServer();
