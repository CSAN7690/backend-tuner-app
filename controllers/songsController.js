const express = require('express');
const songs = express.Router();
const { getAllSongs } = require('../queries/songs');

songs.get("/", async (req, res) => {
    try {
        const allSongs = await getAllSongs();
        if (allSongs.length > 0) {
            res.status(200).json(allSongs);
        } else {
            res.status(404).json({ error: "No songs found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = songs;
