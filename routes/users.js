import express from "express";
const router = express.Router();
import { User, validate } from "../models/user.js";
import bcrypt from "bcrypt";
import auth from "../middelware/auth.js";
import admin from "../middelware/admin.js";
import validObjectId from "../middelware/validObjectId.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res
      .status(403)
      .send({ message: "User with the given id is exists!" });
  }

  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  let newUser = await new User({
    ...req.body,
    password: hashPassword,
  }).save();

  newUser.password = undefined;
  newUser.__v = undefined;

  res
    .status(200)
    .send({ data: newUser, message: "Account created successfully..." });
});

// get all user routes

router.get("/", admin, async (req, res) => {
  const users = await User.find().select("-password -__v");
  res.status(200).send({ data: users });
});

// get user by id

router.get("/:id", [validObjectId, auth], async (req, res) => {
  const user = await User.findById(req.params.id).select("-password -__v");
  if (!user) {
    return res.status(400).send({ message: "User not available." });
  }
  res.status(200).send({ data: user });
});

// update user by id

router.put("/:id", [validObjectId, auth], async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  ).select("-password -__v");
  res.status(200).send({ data: user, message: "Profile updated successfully" });
});

// delete user by id

router.delete("/:id", [validObjectId, admin], async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(400).send({ message: "User not found!" });
  }
  res.status(200).send({ message: "Successfuly deleted user." });
});

export default router;
