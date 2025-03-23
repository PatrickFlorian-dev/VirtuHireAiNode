// seeders/20250322-seed-fake-data.js
import { faker } from '@faker-js/faker';
import { sequelize } from '../config/db.js';
import { Company, User, Role, Job, Candidate, Interview } from '../models/associations.js';

export const seedFakeData = async () => {
  try {
    await sequelize.authenticate();
    console.log('📡 Connected to DB');

    const roles = await Role.findAll();
    if (roles.length === 0) {
      throw new Error('🚨 No roles found! Please seed enums first.');
    }

    let companyCount = 0;
    let userCount = 0;
    let jobCount = 0;
    let candidateCount = 0;
    let interviewCount = 0;

    for (let i = 0; i < 5; i++) {
      const company = await Company.create({
        companyName: faker.company.name(),
        companyDescription: faker.company.catchPhrase(),
        active: faker.datatype.boolean(),
      });
      companyCount++;

      const users = [];
      for (let j = 0; j < 5; j++) {
        const role = faker.helpers.arrayElement(roles);
        const user = await User.create({
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          position: faker.person.jobTitle(),
          description: faker.lorem.sentence(),
          userPrefs: { theme: faker.helpers.arrayElement(['dark', 'light']) },
          roleId: role.id,
          companyId: company.id,
          active: faker.datatype.boolean(),
        });
        users.push(user);
        userCount++;
      }

      const jobs = [];
      for (let k = 0; k < 3; k++) {
        const job = await Job.create({
          jobName: faker.person.jobTitle(),
          jobDescription: faker.lorem.paragraph(),
          statusId: faker.helpers.rangeToNumber({ min: 1, max: 4 }), // JobStatus ID range
          leadRecruiterId: faker.helpers.arrayElement(users).id,
          companyId: company.id,
          active: faker.datatype.boolean(),
        });
        jobs.push(job);
        jobCount++;
      }

      for (const job of jobs) {
        for (let c = 0; c < 5; c++) {
          const candidate = await Candidate.create({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            jobId: job.id,
            phase: faker.word.sample(),
            email: faker.internet.email(),
            phoneNumber: faker.phone.number(),
            address: faker.location.streetAddress(),
            address2: faker.location.secondaryAddress(),
            city: faker.location.city(),
            country: faker.location.country(),
            state: faker.location.state(),
            county: faker.location.county(),
            citizenshipStatus: faker.location.country(),
            needSponsorship: faker.datatype.boolean(),
            gender: faker.person.sex(),
            dob: faker.date.birthdate(),
            veteranStatus: faker.datatype.boolean(),
            disability: faker.datatype.boolean(),
            openToRelocation: faker.datatype.boolean(),
            remote: faker.datatype.boolean(),
            secretJobCode: faker.string.alphanumeric(8),
            secretJobCodeExpiration: faker.date.future(),
            otherInfo: { hobbies: faker.lorem.words(3) },
            active: faker.datatype.boolean(),
          });
          candidateCount++;

          for (let i = 0; i < 2; i++) {
            await Interview.create({
              candidateId: candidate.id,
              jobId: job.id,
              score: faker.helpers.rangeToNumber({ min: 1, max: 10 }),
              interviewDate: faker.date.future(),
              interviewType: faker.helpers.arrayElement(['phone', 'onsite', 'virtual']),
              statusId: faker.helpers.rangeToNumber({ min: 1, max: 6 }), // InterviewStatus ID range
            });
            interviewCount++;
          }
        }
      }
    }

    console.log('✅ Fake Data Seeding Complete!');
    console.log(`🏢 Companies: ${companyCount}`);
    console.log(`👤 Users: ${userCount}`);
    console.log(`📄 Jobs: ${jobCount}`);
    console.log(`🎯 Candidates: ${candidateCount}`);
    console.log(`🗓️ Interviews: ${interviewCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

// Auto-run if file called directly
if (process.argv[1].includes('20250322-seed-fake-data.js')) {
  await seedFakeData();
}
