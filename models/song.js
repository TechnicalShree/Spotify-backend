import mongoose from "mongoose";
import Joi from "joi";

const songSchema = new mongoose.Schema({
  name: { type: String, require: true },
  artis: { type: String, require: true },
  song: { type: String, require: true },
  img: { type: String, require: true },
  duration: { type: String, require: true },
});

export const validate = (song) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    artis: Joi.string().required(),
    song: Joi.string().required(),
    img: Joi.string().required(),
    duration: Joi.number().required(),
  });

  return schema.validate(song);
};

export const Song = mongoose.model("song", songSchema);
