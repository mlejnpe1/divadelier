import { login, logout } from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.js";
import express from "express";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);

router.get("/me", auth, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    first_name: req.user.first_name,
    second_name: req.user.second_name,
    admin: req.user.admin,
  });
});

export default router;
