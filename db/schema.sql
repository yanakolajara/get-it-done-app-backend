DROP DATABASE IF EXISTS task_app;
CREATE DATABASE task_app;

\c task_app;

DROP TABLE IF EXISTS childTasks;
DROP TABLE IF EXISTS parentTasks;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS details;

--------* TASK SECTION ---------

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(20),
    middleName VARCHAR(20) DEFAULT NULL,
    lastName VARCHAR(50),
    email VARCHAR(100),
    countryCode INT CHECK (countryCode >= 1 and countryCode <= 999),
    phone VARCHAR(10),
    authToken VARCHAR(50)
);

CREATE TABLE details(
    id SERIAL PRIMARY KEY,
    test VARCHAR(50)
);

CREATE TABLE parentTasks(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    details_id INTEGER REFERENCES details(id),
    content TEXT,
    progress_state INT CHECK (progress_state >= 1 and progress_state <= 3),
    is_staged BOOLEAN DEFAULT FALSE,
    date DATE NOT NULL,
    position INTEGER
);

CREATE TABLE childTasks(
    id SERIAL PRIMARY KEY,
    parentTask_id INTEGER REFERENCES parentTasks(id)
    ON DELETE CASCADE,
    details_id INTEGER REFERENCES details(id),
    content TEXT,
    completed BOOLEAN DEFAULT FALSE,
    physical_energy INT CHECK (physical_energy >= 0 and physical_energy <= 4),
    emotional_energy INT CHECK (physical_energy >= 0 and physical_energy <= 12),
    position INTEGER
);