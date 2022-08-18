import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const complexityOptions = {
  min: 5,
  max: 250,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  month: { type: String, required: true },
  date: { type: String, required: true },
  year: { type: String, required: true },
  likedSongs: { type: [String], default: [] },
  playlists: { type: [String], default: [] },
  isAdmin: { type: Boolean, default: false },
});

userSchema.methods.generateAuthToken = function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id, name: user.name, isAdmin: user.isAdmin },
    process.env.JWSPRIVATEKEY
  );
  return token;
};

export const validate = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(10).required(),
    email: Joi.string().required(),
    password: passwordComplexity(complexityOptions),
    month: Joi.string().required(),
    date: Joi.string().required(),
    year: Joi.string().required(),
    gender: Joi.string().valid("male", "female", "non-binary").required(),
  });

  return schema.validate(user);
};

export const User = mongoose.model("user", userSchema);
