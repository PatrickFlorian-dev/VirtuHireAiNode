import User from "./userModel.js";
import Candidate from "./candidateModel.js";
import Interview from "./interviewModel.js";
import Job from "./jobModel.js";
import Role from "./roleModel.js";
import Company from "./companyModel.js";
import JobStatus from "./jobStatusModel.js";
import InterviewStatus from "./interviewStatusModel.js";

const initializeModels = () => {
  User.sync();
  Candidate.sync();
  Interview.sync();
  Job.sync();
  Role.sync();
  Company.sync();
  JobStatus.sync();
  InterviewStatus.sync();
};

export { User, Candidate, Interview, Job, Role, Company, JobStatus, InterviewStatus, initializeModels };