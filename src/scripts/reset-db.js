// scripts/reset-db.js
import '../models/associations.js'; // Make sure associations are loaded
import { sequelize } from '../config/db.js';
import { seedEnums } from '../seeders/20250322-seed-enums.js';
import { seedFakeData } from '../seeders/20250322-seed-fake-data.js';

const resetDatabase = async () => {
  try {
    console.log('🧨 Dropping & syncing tables...');
    await sequelize.sync({ force: true }); // This does full DROP + CREATE for you!

    console.log('🌱 Seeding lookup (enum) tables...');
    await seedEnums();

    console.log('🌱 Seeding fake relational data...');
    await seedFakeData();

    console.log('🎉 Database reset & seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Reset DB Error:', err);
    process.exit(1);
  }
};

resetDatabase();
