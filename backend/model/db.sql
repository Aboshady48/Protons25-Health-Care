-- USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    password VARCHAR(255) NOT NULL, -- store hashed password
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TASKS TABLE (Daily Planner)
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority INT CHECK(priority BETWEEN 1 AND 5), -- 1=lowest, 5=highest
    completed BOOLEAN DEFAULT FALSE,
    scheduled_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MOOD TRACKER TABLE

CREATE TABLE mood_tracker (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    mood mood_enum, -- ENUM for consistency
    total_score INT CHECK(total_score BETWEEN 0 AND 30),
    sleep_quality INT CHECK(sleep_quality BETWEEN 0 AND 3),
    safety_level INT CHECK(safety_level BETWEEN 0 AND 3),
    details TEXT,
    safety_message TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- BIORHYTHM TABLE
\CREATE TABLE biorhythm (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    chronotype chronotype_enum,
    score INT CHECK(score BETWEEN 0 AND 100), -- enforce valid range
    assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- STREAKS TABLE
CREATE TABLE streaks (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
    streak_count INT DEFAULT 0,
    last_completed TIMESTAMP -- use timestamp for precision
);

-- CHOOSES TABLE (Admin-only choices)
CREATE TABLE chooses (
    id SERIAL PRIMARY KEY,
    admin_id INT REFERENCES users(id) ON DELETE CASCADE,
    choice VARCHAR(255) NOT NULL,
    description TEXT,
    score INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- STREAK LOGS (store each completed day)
CREATE TABLE streak_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
    completed_date DATE NOT NULL, -- store only date (no time)
    details TEXT, -- optional notes/details
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, task_id, completed_date) -- prevent duplicates
);

-- Index for faster lookups
CREATE INDEX idx_streak_logs_user_date ON streak_logs(user_id, completed_date);

CREATE TABLE community_feedback(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    feedback TEXT NOT NULL,
    rating INT CHECK(rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)