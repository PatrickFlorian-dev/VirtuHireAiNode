import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  position: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  userPrefs: { type: DataTypes.JSONB },
  roleId: { type: DataTypes.INTEGER, allowNull: false },
  companyId: { type: DataTypes.INTEGER, allowNull: false },
  // For SSO (can be optional based on your SSO strategy)
  ssoProvider: { type: DataTypes.STRING }, // e.g., google, microsoft
  ssoId: { type: DataTypes.STRING }, // external SSO ID
  userPrefs: { type: DataTypes.JSON, allowNull: true },
  active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { timestamps: true });

export default User;