const db = require('../db/dbConfig');

const getAllSongs = async () => {
    try {
        const allSongs = await db.any("SELECT * FROM songs ORDER BY id");
        return allSongs;
    } catch (error) {
        console.error("Error fetching all songs:", error);
        throw error;
    }
};

const getSongById = async (id) => {
    try {
        const song = await db.oneOrNone("SELECT * FROM songs WHERE id = $1", id);
        if (!song) {
            throw new Error(`Song with ID ${id} not found`);
        }
        return song;
    } catch (error) {
        console.error(`Error fetching song with ID ${id}:`, error);
        throw error;
    }
};

const createSong = async (song) => {
    const { name, artist, album, minutes, seconds, is_favorite } = song;
    const duration = `${minutes}:${seconds}`;
    try {
        const newSong = await db.one(
            "INSERT INTO songs (name, artist, album, duration, is_favorite) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, artist, album, duration, is_favorite]
        );
        return newSong;
    } catch (error) {
        console.error("Error creating new song:", error);
        throw error;
    }
};

const updateSong = async (id, song) => {
    const { name, artist, album, duration, is_favorite } = song;
    const durationString = `${duration.minutes}:${duration.seconds}`;
    try {
        const updatedSong = await db.oneOrNone(
            "UPDATE songs SET name = $1, artist = $2, album = $3, duration = $4, is_favorite = $5 WHERE id = $6 RETURNING *",
            [name, artist, album, durationString, is_favorite, id]
        );
        return updatedSong;
    } catch (error) {
        return error;
    }
};

const deleteSong = async (id) => {
    try {
        const deletedSong = await db.oneOrNone("DELETE FROM songs WHERE id = $1 RETURNING *", id);
        return deletedSong;
    } catch (error) {
        return error;
    }
};

const reassignIds = async () => {
    try {
        // Get all songs ordered by the current id
        const allSongs = await db.any("SELECT * FROM songs ORDER BY id");

        // Reset the id sequence
        await db.none("ALTER SEQUENCE songs_id_seq RESTART WITH 1");

        // Reassign ids sequentially
        for (let i = 0; i < allSongs.length; i++) {
            await db.none("UPDATE songs SET id = $1 WHERE id = $2", [i + 1, allSongs[i].id]);
        }
    } catch (error) {
        return error;
    }
};


module.exports = {
    getAllSongs,
    getSongById,
    createSong,
    updateSong,
    deleteSong,
    reassignIds
};
