import express from "express";
const router = express.Router();

import { Song } from "../models/song.js";
import { Playlist } from "../models/playlist.js";
import auth from "../middelware/auth.js";

router.get("/", auth, async (req, res) => {
  const search = req.query.search;
  if (search !== "") {
    const songs = await Song.find({
      name: { $regex: search, $options: "i" },
    }).limit(10);
    const playlists = await Playlist.find({
      name: { $regex: search, $options: "i" },
    }).limit(10);
    res.status(200).send({ data: { songs, playlists } });
  } else {
    res.status(200).send({});
  }
});

export default router;
