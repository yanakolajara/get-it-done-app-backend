DROP DATABASE IF EXISTS get_it_done_app;
CREATE DATABASE get_it_done_app;

\c get_it_done_app;

DROP TABLE IF EXISTS steps;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

--------* TASK SECTION ---------

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(20),
    middle_name VARCHAR(20) DEFAULT NULL,
    last_name VARCHAR(50),
    email VARCHAR(100),
    country_code INT CHECK (country_code >= 1 and country_code <= 999),
    phone VARCHAR(10),
    auth VARCHAR(50)
);

CREATE TABLE tasks(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    content TEXT,
    completed BOOLEAN DEFAULT FALSE,
    date VARCHAR(10),
    previews_task_id INTEGER,
    next_task_id INTEGER
);

CREATE TABLE steps(
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id)
    ON DELETE CASCADE,
    content TEXT,
    completed BOOLEAN DEFAULT FALSE,
    physical_energy INT CHECK (physical_energy >= 0 and physical_energy <= 4),
    emotional_energy INT CHECK (emotional_energy >= 0 and emotional_energy <= 12),
    previews_step_id INTEGER,
    next_step_id INTEGER
);
