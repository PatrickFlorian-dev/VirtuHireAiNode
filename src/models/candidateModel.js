import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Candidate = sequelize.define("Candidate", {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    jobId: { type: DataTypes.INTEGER, allowNull: false },
    phase: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    phoneNumber: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    address2: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    county: { type: DataTypes.STRING },
    citizenshipStatus: { type: DataTypes.STRING },
    needSponsorship: { type: DataTypes.BOOLEAN },
    gender: { type: DataTypes.STRING },
    veteranStatus: { type: DataTypes.BOOLEAN },
    disability: { type: DataTypes.BOOLEAN },
    potential: DataTypes.STRING,
    yearsOfExperience: DataTypes.NUMBER,
    dob: { type: DataTypes.DATE },
    openToRelocation: { type: DataTypes.BOOLEAN },
    remote: { type: DataTypes.BOOLEAN },
    notes: { type: DataTypes.TEXT },
    secretJobCode: { type: DataTypes.STRING },
    secretJobCodeExpiration: { type: DataTypes.DATE },
    otherInfo: { type: DataTypes.JSON },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { timestamps: true });

export default Candidate;
  