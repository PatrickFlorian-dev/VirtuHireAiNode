import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Company = sequelize.define("Company", {
    companyName: { type: DataTypes.STRING, allowNull: false, unique: true },
    companyDescription: { type: DataTypes.TEXT },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { timestamps: true });
  
export default Company;