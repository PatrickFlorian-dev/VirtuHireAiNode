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

    // ✅ Generate exactly 100 companies
    const companies = [];
    for (let i = 0; i < 100; i++) {
      const company = await Company.create({
        companyName: faker.company.name(),
        companyDescription: faker.company.catchPhrase(),
        active: true,
      });
      companies.push(company);
      companyCount++;
    }

    // ✅ Generate exactly 100 users
    const users = [];
    for (let i = 0; i < 100; i++) {
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
        companyId: faker.helpers.arrayElement(companies).id,
        active: true,
      });
      users.push(user);
      userCount++;
    }

    // ✅ Generate exactly 100 jobs
    const jobs = [];
    for (let i = 0; i < 100; i++) {
      const job = await Job.create({
        jobName: faker.person.jobTitle(),
        jobDescription: faker.lorem.paragraph(),
        statusId: faker.helpers.rangeToNumber({ min: 1, max: 4 }),
        leadRecruiterId: faker.helpers.arrayElement(users).id,
        companyId: faker.helpers.arrayElement(companies).id,
        active: true,
      });
      jobs.push(job);
      jobCount++;
    }

    // Ensure jobId = 1 exists
    const jobOne = jobs[0] || (await Job.findByPk(1));
    if (!jobOne) {
      throw new Error("🚨 jobId = 1 does not exist even after seeding!");
    }

    // ✅ Generate exactly 2000 candidates
    for (let i = 0; i < 2000; i++) {
      const assignedJobId = i < 1000 ? jobOne.id : faker.helpers.arrayElement(jobs).id;

      const candidate = await Candidate.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        jobId: assignedJobId,
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
        active: true,
      });

      candidateCount++;

      // ✅ Generate exactly 100 interviews per batch of candidates (Total: 100)
      if (interviewCount < 100) {
        for (let j = 0; j < 2; j++) {
          await Interview.create({
            candidateId: candidate.id,
            jobId: assignedJobId,
            score: faker.helpers.rangeToNumber({ min: 1, max: 10 }),
            interviewDate: faker.date.future(),
            interviewType: faker.helpers.arrayElement(['phone', 'onsite', 'virtual']),
            statusId: faker.helpers.rangeToNumber({ min: 1, max: 6 }),
          });
          interviewCount++;
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
