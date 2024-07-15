const express = require('express');
const songs = express.Router();
const { getAllSongs, getSongById, createSong, updateSong, deleteSong, reassignIds } = require('../queries/songs');

songs.get("/", async (req, res) => {
    try {
        let allSongs = await getAllSongs();
        allSongs = allSongs.map((song, index) => ({
            ...song,
            display_id: index + 1
        }));
        if (allSongs.length > 0) {
            res.status(200).json(allSongs);
        } else {
            res.status(404).json({ error: "No songs found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Show route
songs.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const song = await getSongById(id);
        if (song) {
            res.status(200).json(song);
        } else {
            res.status(404).json({ error: "Song not found" });
        }
    } catch (error) {
        console.error(`Error getting song with ID ${id}:`, error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Create route
songs.post("/", async (req, res) => {
    const { name, artist, album, minutes, seconds, is_favorite } = req.body;
    if (!name || !artist) {
        return res.status(400).json({ error: "Name and artist are required" });
    }
    if (typeof is_favorite !== 'boolean') {
        return res.status(400).json({ error: "is_favorite must be a boolean" });
    }
    try {
        const newSong = await createSong({ name, artist, album, minutes, seconds, is_favorite });
        res.status(201).json(newSong);
    } catch (error) {
        console.error("Error creating new song:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Update Route
songs.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, artist, album, duration, is_favorite } = req.body;
    if (!name || !artist) {
        return res.status(400).json({ error: "Name and artist are required" });
    }
    if (typeof is_favorite !== 'boolean') {
        return res.status(400).json({ error: "is_favorite must be a boolean" });
    }
    if (!duration || typeof duration.minutes !== 'number' || typeof duration.seconds !== 'number') {
        return res.status(400).json({ error: "Duration must have minutes and seconds as numbers" });
    }
    try {
        const updatedSong = await updateSong(id, { name, artist, album, duration, is_favorite });
        if (updatedSong) {
            res.status(200).json(updatedSong);
        } else {
            res.status(404).json({ error: "Song not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete Route
songs.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSong = await deleteSong(id);
        if (deletedSong) {
            await reassignIds(); // Reassign IDs after deletion
            res.status(200).json({ message: "Song deleted successfully", song: deletedSong });
        } else {
            res.status(404).json({ error: "Song not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = songs;

