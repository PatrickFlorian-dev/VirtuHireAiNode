// seeders/20250322-seed-enums.js
// seeders/20250322-seed-enums.js
import { sequelize } from '../config/db.js';
import { Role, JobStatus, InterviewStatus } from '../models/associations.js';

export const seedEnums = async () => {
  try {
    await Role.bulkCreate([
      { roleName: 'recruiter' },
      { roleName: 'manager' },
      { roleName: 'admin' },
      { roleName: 'superadmin' },
    ]);
  
    await JobStatus.bulkCreate([
      { statusName: 'active' },
      { statusName: 'inactive' },
      { statusName: 'research' },
      { statusName: 'onhold' },
    ]);
  
    await InterviewStatus.bulkCreate([
      { statusName: 'pending' },
      { statusName: 'passed' },
      { statusName: 'failed' },
      { statusName: 'rescinded' },
      { statusName: 'didnotattend' },
      { statusName: 'prospect' },
    ]);

    console.log('✅ ENUM tables seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Only auto-run if called directly via `node`
if (process.argv[1].includes('20250322-seed-enums.js')) {
  await sequelize.authenticate(); // optional: ensure DB connection
  await seedEnums();
}
