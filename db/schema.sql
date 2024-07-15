DROP TABLE IF EXISTS songs;

\c tuner_playlist;

CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT NOT NULL,
    duration TEXT NOT NULL,
    is_favorite BOOLEAN DEFAULT false
);