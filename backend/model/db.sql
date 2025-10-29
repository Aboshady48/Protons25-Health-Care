-- USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
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
CREATE TABLE biorhythm (
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

-- QUESTIONS AND OPTIONS TABLES
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'default'
);

CREATE TABLE question_options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  label VARCHAR(255) NOT NULL,
  value INTEGER NOT NULL
);

-- Questions table
CREATE TABLE biorhythm_questions (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL
);

-- Options table
CREATE TABLE biorhythm_options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES biorhythm_questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    points JSONB NOT NULL  -- store {"Morning": 3, "Balanced": 2} etc.
);

-- Results table (user answers)
CREATE TABLE biorhythm_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    answers JSONB,          -- {"q1": "optionId", ...}
    scores JSONB,           -- {"Morning": 12, "Balanced": 8, ...}
    top_profile VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE biorhythm_profiles (
    id SERIAL PRIMARY KEY,
    profile_key VARCHAR(50) UNIQUE NOT NULL, -- 'Morning', 'Evening', etc.
    profile_name VARCHAR(255) NOT NULL,
    description TEXT,
    best_focus TEXT,
    best_exercise_time TEXT,
    meal_rhythm TEXT,
    tip TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default profiles
INSERT INTO biorhythm_profiles (profile_key, profile_name, description, best_focus, best_exercise_time, meal_rhythm, tip) VALUES
('Morning', 'Morning Type (Early Bird)', 'People who are most productive in early morning hours', 'Early morning (6–10 AM)', 'Morning workouts give you energy', 'A good breakfast is key for your day', 'Plan creative or study-heavy tasks early. Use afternoons for light work or rest.'),
('Midday', 'Midday Type (Balanced)', 'Balanced energy throughout the day with peak at midday', 'Late morning to early afternoon', 'Around lunch or early afternoon', 'Lunch is your main refuel point', 'Structure important tasks between 10 AM–2 PM, and keep evenings lighter.'),
('Afternoon', 'Afternoon Type (Productive After Lunch)', 'Peak productivity in afternoon hours', 'Afternoon (2–6 PM)', 'Late afternoon workouts feel natural', 'Balanced meals, but avoid heavy lunch that causes energy dips', 'Do routine tasks in the morning, save big goals and studying for the afternoon peak.'),
('Evening', 'Evening/Night Type (Night Owl)', 'Most productive during evening and night hours', 'Evening or late night', 'Evening workouts boost mood', 'Lighter breakfast, larger dinner suits your rhythm', 'Organize your day so that creative or focus-heavy tasks are at night, and mornings are slower.'),
('Balanced', 'Balanced Type (All-Day Steady)', 'Consistent energy levels throughout the day', 'Moderate focus spread throughout the day', 'Flexible, can do morning or evening', 'Three balanced meals, not too early or late', 'You''re naturally adaptable. Use this to adjust when life gets busy.'),
('Variable', 'Variable Type (Energy Shifter)', 'Energy patterns that change day to day', 'It changes — sometimes morning, sometimes night', 'Whenever energy feels high', 'Irregular — sometimes skipping meals or eating late', 'Track your mood/energy daily so the planner can adjust for your ''shifting rhythm.'''),
('ShortSleeper', 'Short-Sleeper Type (High Energy, Less Sleep)', 'High energy with less sleep requirement', 'Sharp bursts of focus throughout the day', 'Short, intense workouts (any time)', 'Small meals/snacks keep energy stable', 'Use your bursts wisely — do big tasks in short focus windows.'),
('SlowStarter', 'Slow-Starter Type (Late Energizer)', 'Energy builds slowly throughout the day', 'Starts low in the morning, energy builds slowly', 'Midday or afternoon works best', 'Light breakfast, bigger lunch', 'Don''t pressure yourself early. Schedule important tasks later in the day.');

-- AI CHATS TABLE
CREATE TABLE chats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  model_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
  sender VARCHAR(10) CHECK (sender IN ('user', 'ai')),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
