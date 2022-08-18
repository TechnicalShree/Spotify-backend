import express from "express";
const router = express.Router();

import { Playlist, validate } from "../models/playlist.js";
import { Song } from "../models/song.js";
import { User } from "../models/user.js";
import auth from "../middelware/auth.js";
import validObjectId from "../middelware/validObjectId.js";
import Joi from "joi";

// create playlist

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  const user = await User.findById(req.user._id);
  const playlist = await Playlist({ ...req.body, user: user._id }).save();
  user.playlists.push(playlist._id);

  await user.save();
  res.status(201).send({ data: playlist });
});

// update playlist

router.put("/edit/:id", [validObjectId, auth], async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().allow(""),
    img: Joi.string().allow(""),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    return res.status(400).send({ message: "Playlist not found." });
  }

  const user = await User.findById(req.user._id);
  if (!user._id.equals(playlist.user)) {
    return res
      .status(403)
      .send({ message: "User don't have access to edit playlist." });
  }

  playlist.name = req.body.name;
  playlist.desc = req.body.desc;
  playlist.img = req.body.img;
  await playlist.save();

  res.status(200).send({ data: playlist, message: "Updated succcessfully." });
});

// add song to playlist

router.put("/add-song", auth, async (req, res) => {
  const schema = Joi.object({
    playlistId: Joi.string().required(),
    songId: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  const user = await User.findById(req.user._id);
  const playlist = await Playlist.findById(req.body.playlistId);
  if (!user._id.equals(playlist.user)) {
    return res.status(403).send({ message: "User don't have access to add." });
  }

  if (playlist.songs.indexOf(req.body.songId) === -1) {
    playlist.songs.push(req.body.songId);
  } else {
    return res
      .status(200)
      .send({ data: playlist, message: "You have already added that song." });
  }

  await playlist.save();

  res.status(200).send({ data: playlist, message: "Successfully added song." });
});

// remove song from playlist

router.put("/remove-song", auth, async (req, res) => {
  const schema = Joi.object({
    playlistId: Joi.string().required(),
    songId: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  const user = await User.findById(req.user._id);
  const playlist = await Playlist.findById(req.body.playlistId);
  if (!user._id.equals(playlist.user)) {
    return res
      .status(403)
      .send({ message: "User don't have access to remove." });
  }

  const index = playlist.songs.indexOf(req.body.songId);
  if (index === -1) {
    return res.status(400).send({ message: "Song not found in playlist" });
  }

  playlist.songs.splice(index, 1);
  await playlist.save();

  res.status(200).send({ data: playlist, message: "Successfully removed." });
});

// user favorite playlist

router.get("/favourite", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const playlists = await Playlist.findById({ _id: user.playlists });
  if (!playlists) {
    return res.status(400).send({ message: "User don't have playlist Yet." });
  }
  res.status(200).send({ data: playlists });
});

// get random playlist

router.get("/random", auth, async (req, res) => {
  const playlists = await Playlist.aggregate([{ $sample: { size: 10 } }]);

  res.status(200).send({ data: playlists });
});

// get playlist by id

router.get("/:id", [validObjectId, auth], async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    return res.status(404).send("Playlist not found.");
  }

  const songs = await Song.findById({ _id: playlist.songs });
  res.status(200).send({ data: { playlist, songs } });
});

//get all playlist

router.get("/", auth, async (req, res) => {
  const playlists = await Playlist.find();
  if (!playlists) {
    return res.status(400).send({ message: "You don't have any playlist." });
  }
  res.status(200).send({ data: playlists });
});

// delete playlist by id

router.delete("/:id", [validObjectId, auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) {
    return res.status(400).send({ message: "Playlist not found." });
  }
  if (!user._id.equals(playlist.user)) {
    return res
      .status(403)
      .send({ message: "User don't have access to delete." });
  }

  const index = user.playlists.indexOf(req.params.id);
  user.playlists.splice(index, 1);
  await user.save();
  await playlist.remove();
  res.status(200).send({ message: "Playlist removed from library." });
});

export default router;
