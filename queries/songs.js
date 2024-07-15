const db = require('../db/dbConfig');

const getAllSongs = async () => {
    try {
        const allSongs = await db.any("SELECT * FROM songs");
        return allSongs;
    } catch (error) {
        return error;
    }
};

const getSongById = async (id) => {
    try {
        const song = await db.oneOrNone("SELECT * FROM songs WHERE id = $1", id);
        return song;
    } catch (error) {
        return error;
    }
}

module.exports = {
    getAllSongs,
    getSongById
};
