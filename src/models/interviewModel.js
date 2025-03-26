import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Interview = sequelize.define("Interview", {
    candidateId: { type: DataTypes.INTEGER, allowNull: false },
    jobId: { type: DataTypes.INTEGER, allowNull: false },
    score: { type: DataTypes.INTEGER },
    interviewDate: { type: DataTypes.DATE },
    interviewType: { type: DataTypes.STRING },
    notes: { type: DataTypes.TEXT },
    statusId: { type: DataTypes.INTEGER, allowNull: false }
}, { timestamps: true });

export default Interview;
