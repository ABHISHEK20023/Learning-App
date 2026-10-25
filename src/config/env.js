import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/learning_game",
  adminApiKey: process.env.ADMIN_API_KEY || "change-me-admin-key",
};
