import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const JobStatus = sequelize.define("JobStatus", {
    statusName: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, { timestamps: false });

export default JobStatus;
  