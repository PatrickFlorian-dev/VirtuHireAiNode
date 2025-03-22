import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite"
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("SQL database connected successfully");
  } catch (error) {
    console.error("SQL database connection error:", error);
    process.exit(1);
  }
};

export { sequelize, connectDB };