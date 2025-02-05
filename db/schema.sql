DROP TABLE IF EXISTS songs;

CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT,
    duration TIME,
    is_favorite BOOLEAN
);
