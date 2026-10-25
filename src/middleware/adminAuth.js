import { env } from "../config/env.js";

export function adminAuth(req, res, next) {
  const key = req.header("x-admin-key");
  if (!key || key !== env.adminApiKey) {
    return res.status(401).json({
      success: false,
      message: "Admin API key is required",
    });
  }
  return next();
}
