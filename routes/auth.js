import express from "express";
const router = express.Router();
import { User } from "../models/user.js";
import bcrypt from "bcrypt";

router.post("/", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send({ message: "Invalid email or password!" });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    return res.status(400).send({ message: "Invalid email or password!" });
  }

  const token = await user.generateAuthToken();
  res.status(200).send({ data: token, message: "Signing in please wait..." });
});

export default router;
