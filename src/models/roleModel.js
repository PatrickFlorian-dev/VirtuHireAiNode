import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Role = sequelize.define("Role", {
    roleName: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, { timestamps: false });

export default Role;