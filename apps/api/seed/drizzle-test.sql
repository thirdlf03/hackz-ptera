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
    winner TEXT CHECK (winner IN ('player', 'enemy', 'draw') OR winner IS NULL) DEFAULT NULL,
    FOREIGN KEY (player_id) REFERENCES users(id),
    FOREIGN KEY (enemy_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    attack INTEGER NOT NULL CHECK (attack IN (0, 1)),
    reason TEXT NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(id)
);

CREATE TABLE IF NOT EXISTS personalitys (
    id INTEGER PRIMARY KEY,
    obedience REAL NOT NULL,
    aggressiveness REAL NOT NULL,
    fear REAL NOT NULL,
    randomness REAL NOT NULL
);

INSERT INTO users (name) VALUES ("hello");
INSERT INTO users (id, name) VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Player');
INSERT INTO users (id, name) VALUES ('550e8400-e29b-41d4-a716-446655440001', 'Enemy');

INSERT INTO games (player_id, enemy_id, first_player) VALUES ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'player');

INSERT INTO logs (game_id, "from", "to", attack, reason) VALUES (1, 'a1', 'a2', 1, 'Attacked to a2');