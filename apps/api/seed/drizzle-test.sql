PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id TEXT NOT NULL,
    enemy_id TEXT NOT NULL,
    first_player TEXT NOT NULL,
    winner TEXT CHECK (winner IN ("player", "enemy", 'draw') OR winner IS NULL) DEFAULT NULL,
    FOREIGN KEY (player_id) REFERENCES users(id),
    FOREIGN KEY (enemy_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    player_id TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    attack INTEGER NOT NULL CHECK (attack IN (0, 1)),
    FOREIGN KEY (game_id) REFERENCES games(id),
    FOREIGN KEY (player_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS personalitys (
    id INTEGER PRIMARY KEY,
    obedience REAL NOT NULL,
    aggressiveness REAL NOT NULL,
    fear REAL NOT NULL,
    randomness REAL NOT NULL
);

INSERT INTO users (name) VALUES ("hello");