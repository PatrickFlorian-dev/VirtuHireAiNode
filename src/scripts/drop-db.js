// scripts/drop-tables.js
import { sequelize } from '../config/db.js';
import './associations.js'; // Only for associations side-effects

const dropAllTables = async () => {
  try {
    console.log('Dropping all tables...');
    // Drops everything related to the current DB schema
    await sequelize.drop({ cascade: true });
    console.log('✅ All tables dropped!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error dropping tables:', error);
    process.exit(1);
  }
};

dropAllTables();