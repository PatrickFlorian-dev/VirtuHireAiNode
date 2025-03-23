// models/associations.js
import Company from './companyModel.js';
import User from './userModel.js';
import Role from './roleModel.js';
import Job from './jobModel.js';
import JobStatus from './jobStatusModel.js';
import Candidate from './candidateModel.js';
import Interview from './interviewModel.js';
import InterviewStatus from './interviewStatusModel.js';

// Company & User
Company.hasMany(User, { foreignKey: 'companyId', onDelete: 'CASCADE' });
User.belongsTo(Company, { foreignKey: 'companyId' });

// User & Role
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

// Company & Job
Company.hasMany(Job, { foreignKey: 'companyId', onDelete: 'CASCADE' });
Job.belongsTo(Company, { foreignKey: 'companyId' });

// Job & JobStatus
JobStatus.hasMany(Job, { foreignKey: 'statusId' });
Job.belongsTo(JobStatus, { foreignKey: 'statusId' });

// Job & Lead Recruiter (User)
User.hasMany(Job, { foreignKey: 'leadRecruiterId', as: 'LeadRecruiter' });
Job.belongsTo(User, { foreignKey: 'leadRecruiterId', as: 'LeadRecruiter' });

// Job & Candidate
Job.hasMany(Candidate, { foreignKey: 'jobId' });
Candidate.belongsTo(Job, { foreignKey: 'jobId' });

// Candidate & Interview
Candidate.hasMany(Interview, { foreignKey: 'candidateId' });
Interview.belongsTo(Candidate, { foreignKey: 'candidateId' });

// Interview & Job
Job.hasMany(Interview, { foreignKey: 'jobId' });
Interview.belongsTo(Job, { foreignKey: 'jobId' });

// Interview & InterviewStatus
InterviewStatus.hasMany(Interview, { foreignKey: 'statusId' });
Interview.belongsTo(InterviewStatus, { foreignKey: 'statusId' });

export { Company, User, Role, Job, JobStatus, Candidate, Interview, InterviewStatus };