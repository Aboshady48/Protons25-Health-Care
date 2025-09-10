CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
--Daily Planner
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    scheduled_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mood_energy (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    mood INT CHECK(mood BETWEEN 1 AND 10),     
    energy INT CHECK(energy BETWEEN 1 AND 10), 
    logged_at DATE DEFAULT CURRENT_DATE
);

CREATE TABLE biorhythm (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    chronotype VARCHAR(50), -- "Morning", "Evening", "Intermediate"
    score INT,
    assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

