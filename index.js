import dotenv from "dotenv";
import express from "express";
import dbconnect from "./db.js";
import cors from "cors";
import "express-async-errors";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import songRoutes from "./routes/songs.js";
import playlistRoutes from "./routes/playlist.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

dbconnect();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/users", userRoutes);
app.use("/api/login", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/playlists", playlistRoutes);

app.listen(port, console.log(`Listening on port ${port}...`));
