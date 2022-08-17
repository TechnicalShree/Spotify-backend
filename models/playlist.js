import mongoose from "mongoose";
import Joi from "joi";

const ObjectId = mongoose.Schema.Types.ObjectId;

const playlistSchema = new mongoose.Schema({
  name: { type: String, require: true },
  user: { type: ObjectId, ref: "user", require: true },
  desc: { type: String },
  songs: { type: Array, default: [] },
  img: { type: String },
});

export const validate = (playlist) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    user: Joi.string().required(),
    desc: Joi.string().allow(""),
    songs: Joi.array().items(Joi.string()),
    img: Joi.string().allow(""),
  });

  return schema.validate(playlist);
};

export const Playlist = mongoose.model("playlist", playlistSchema);
