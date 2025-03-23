import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const InterviewStatus = sequelize.define("InterviewStatus", {
    statusName: { type: DataTypes.STRING, allowNull: false, unique: true }
}, { timestamps: false });

export default InterviewStatus;  