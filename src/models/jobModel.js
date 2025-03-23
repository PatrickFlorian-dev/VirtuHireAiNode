import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Job = sequelize.define("Job", {
    jobName: { type: DataTypes.STRING, allowNull: false },
    jobDescription: { type: DataTypes.TEXT },
    statusId: { type: DataTypes.INTEGER, allowNull: false },
    leadRecruiterId: { type: DataTypes.INTEGER }, // FK to User
    companyId: { type: DataTypes.INTEGER, allowNull: false },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { timestamps: true });

export default Job;